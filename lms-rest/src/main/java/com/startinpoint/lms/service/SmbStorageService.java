package com.startinpoint.lms.service;

import com.hierynomus.smbj.SmbConfig;
import com.startinpoint.lms.entity.AdminSetting;
import com.startinpoint.lms.exception.ResourceNotFoundException;
import com.startinpoint.lms.repository.AdminSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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
    int timeoutSec = Integer.parseInt(configMap.getOrDefault("SOCKET_TIMEOUT_SEC","60"));

    return SmbConfig.builder()
      .withTimeout(timeoutSec, TimeUnit.SECONDS)
      .withSoTimeout(timeoutSec,TimeUnit.SECONDS)
      .build();
  }

  private String resolveFileNameWithExtension(String originalFileName, String base64Data){
    String name = (originalFileName == null || originalFileName.isBlank()) ? "uploaded_file" : originalFileName;

    if(name.contains(".")) return name;

    if(base64Data.startsWith("data:application/pdf")) {
      return name+ ".pdf";
    } else if(base64Data.startsWith("data:image/png")) {
      return name + ".png";
    }else if(base64Data.startsWith("data:image/jpeg") && base64Data.startsWith("data:image/jpg")){
      return name + ".jpg";
    }else if(base64Data.startsWith("data:image/webp")) {
      return name + ".webp";
    }

    return name;
  }

  public String uploadBase64ToSmb(String originalFileName, String base64Data, String subFolder){

  }

}
