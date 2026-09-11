package com.startinpoint.lms.service;

import com.hierynomus.msdtyp.AccessMask;
import com.hierynomus.mssmb2.SMB2CreateDisposition;
import com.hierynomus.mssmb2.SMB2Dialect;
import com.hierynomus.mssmb2.SMB2ShareAccess;
import com.hierynomus.smbj.SMBClient;
import com.hierynomus.smbj.SmbConfig;
import com.hierynomus.smbj.auth.AuthenticationContext;
import com.hierynomus.smbj.connection.Connection;
import com.hierynomus.smbj.session.Session;
import com.hierynomus.smbj.share.DiskShare;
import com.hierynomus.smbj.share.File;
import com.startinpoint.lms.entity.AdminSetting;
import com.startinpoint.lms.exception.BadRequestException;
import com.startinpoint.lms.exception.ResourceNotFoundException;
import com.startinpoint.lms.repository.AdminSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SmbStorageService {
  private final AdminSettingRepository adminSettingRepository;

  public Map<String, String> getSmbConfigurations(){
    List<AdminSetting> settings = adminSettingRepository.findByCategoryName("FILE_SERVER");
    if (settings.isEmpty()){
      throw new ResourceNotFoundException("File Server Settings are not configured in admin setting.");
    }

    return settings.stream().collect(Collectors.toMap(AdminSetting::getLabel, AdminSetting::getValue));
  }

  public SmbConfig getSubConfig(Map<String, String> configMap){
    int timeoutSec = Integer.parseInt(configMap.getOrDefault("SOCKET_TIMEOUT_SEC","200"));

    return SmbConfig.builder()
      .withTimeout(timeoutSec, TimeUnit.SECONDS)
      .withSoTimeout(timeoutSec,TimeUnit.SECONDS)
      .withDialects(SMB2Dialect.SMB_2_0_2, SMB2Dialect.SMB_2_1, SMB2Dialect.SMB_3_0)
      .build();
  }

  private String resolveFileNameWithExtension(String originalFileName, String base64Data){
    String name = (originalFileName == null || originalFileName.isBlank()) ? "uploaded_file" : originalFileName;

    if(name.contains(".")) return name;

    if(base64Data.startsWith("data:application/pdf")) {
      return name+ ".pdf";
    } else if(base64Data.startsWith("data:image/png")) {
      return name + ".png";
    }else if(base64Data.startsWith("data:image/jpeg") || base64Data.startsWith("data:image/jpg")){
      return name + ".jpg";
    }else if(base64Data.startsWith("data:image/webp")) {
      return name + ".webp";
    }

    return name;
  }

  public String uploadBase64ToSmb(String originalFileName, String base64Data, String subFolder){
    if(base64Data == null || base64Data.isBlank()){
      throw new BadRequestException("Invalid Base64 payload");
    }

    String finalFileName =resolveFileNameWithExtension(originalFileName,base64Data);
    String cleanBase64 = base64Data.contains(",")
      ? base64Data.substring(base64Data.indexOf(",")+1)
      : base64Data;

    byte[] fileBytes;
    try{
      fileBytes = Base64.getDecoder().decode(cleanBase64.trim());
    }catch (IllegalArgumentException e){
      throw new BadRequestException("Invalid base64 payload format.");
    }

    Map<String, String> configMap = getSmbConfigurations();
    String serverName = configMap.getOrDefault("SERVER_NAME","");
    String sharedName = configMap.getOrDefault("SHARED_NAME","");
    String domainName = configMap.getOrDefault("DOMAIN_NAME","");
    String username = configMap.getOrDefault("USERNAME","");
    String password = configMap.getOrDefault("PASSWORD","");


    SmbConfig smbConfig = getSubConfig(configMap);
    try(
      SMBClient client = new SMBClient(smbConfig);
      Connection connection = client.connect(serverName);
      ){
      AuthenticationContext context = new AuthenticationContext(username, password.toCharArray(),domainName);
      Session session = connection.authenticate(context);

      try(DiskShare share = (DiskShare) session.connectShare(sharedName)){
        if(subFolder != null || !subFolder.isBlank()){
          String[] folders = subFolder.split("[/\\\\]");
          String currentPath = "";
          for (String folder : folders){
            currentPath = currentPath.isEmpty() ? folder : currentPath + "/"+ folder;
            if(!share.folderExists(currentPath)){
              share.mkdir(currentPath);
            }
          }
        }

        String uniqueFileName =generateUniqueFileName(share,subFolder,finalFileName);
        String relativePath = (subFolder == null || subFolder.isBlank())
          ? uniqueFileName
          : subFolder + "/" + uniqueFileName;

        try(
          File smbFile = share.openFile(
            relativePath, EnumSet.of(AccessMask.GENERIC_WRITE),
            null, SMB2ShareAccess.ALL,
            SMB2CreateDisposition.FILE_OVERWRITE_IF,
            null
          );
          OutputStream smbOut = smbFile.getOutputStream();
          InputStream byteIn = new ByteArrayInputStream(fileBytes);
        ){
          byteIn.transferTo(smbOut);
        }
        return relativePath;
      }
    }catch (Exception e){
      throw new RuntimeException("Failed to load binary file to smb share.");
    }

  }

  private String generateUniqueFileName(DiskShare share, String subFolder, String fileName) {
    String basePath = (subFolder == null || subFolder.isBlank()) ? "" : subFolder + "/";

    if (!share.fileExists(basePath + fileName)) {
      return fileName;
    }

    String nameWithoutExt = fileName;
    String extension = "";

    int dotIndex = fileName.lastIndexOf('.');
    if (dotIndex > 0) {
      nameWithoutExt = fileName.substring(0, dotIndex);
      extension = fileName.substring(dotIndex); // includes the dot e.g. ".pdf"
    }

    int counter = 1;
    String candidateName;
    do {
      candidateName = nameWithoutExt + "(" + counter + ")" + extension;
      counter++;
    } while (share.fileExists(basePath + candidateName));

    return candidateName;
  }

}
