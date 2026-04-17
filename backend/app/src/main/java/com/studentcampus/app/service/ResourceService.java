package com.studentcampus.app.service;

import com.studentcampus.app.dto.ResourceRequestDto;
import com.studentcampus.app.dto.ResourceResponseDto;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;

import java.util.List;

public interface ResourceService {
    ResourceResponseDto createResource(ResourceRequestDto dto);
    ResourceResponseDto getResourceById(String id);
    List<ResourceResponseDto> getAllResources();
    List<ResourceResponseDto> searchResources(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
    ResourceResponseDto updateResource(String id, ResourceRequestDto dto);
    ResourceResponseDto updateResourceStatus(String id, ResourceStatus status);
    void deleteResource(String id);
}