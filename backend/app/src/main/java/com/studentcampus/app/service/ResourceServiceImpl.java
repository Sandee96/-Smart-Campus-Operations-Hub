package com.studentcampus.app.service;

import com.studentcampus.app.dto.ResourceRequestDto;
import com.studentcampus.app.dto.ResourceResponseDto;
import com.studentcampus.app.exception.ResourceNotFoundException;
import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import com.studentcampus.app.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        Resource resource = Resource.builder()
                .name(dto.getName())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .availabilityWindows(dto.getAvailabilityWindows())
                .status(dto.getStatus() != null ? dto.getStatus() : ResourceStatus.ACTIVE)
                .build();

        return mapToDto(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponseDto getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        return mapToDto(resource);
    }

    @Override
    public List<ResourceResponseDto> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
public List<ResourceResponseDto> searchResources(ResourceType type, Integer minCapacity,
                                                  String location, ResourceStatus status) {
    List<Resource> all = resourceRepository.findAll();

    return all.stream()
            .filter(r -> type == null || r.getType() == type)
            .filter(r -> minCapacity == null || (r.getCapacity() != null && r.getCapacity() >= minCapacity))
            .filter(r -> location == null || (r.getLocation() != null && r.getLocation().toLowerCase().contains(location.toLowerCase())))
            .filter(r -> status == null || r.getStatus() == status)
            .map(this::mapToDto)
            .collect(Collectors.toList());
}
    @Override
    public ResourceResponseDto updateResource(String id, ResourceRequestDto dto) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        resource.setName(dto.getName());
        resource.setType(dto.getType());
        resource.setCapacity(dto.getCapacity());
        resource.setLocation(dto.getLocation());
        resource.setDescription(dto.getDescription());
        resource.setAvailabilityWindows(dto.getAvailabilityWindows());
        if (dto.getStatus() != null) {
            resource.setStatus(dto.getStatus());
        }

        return mapToDto(resourceRepository.save(resource));
    }

    @Override
    public ResourceResponseDto updateResourceStatus(String id, ResourceStatus status) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
        resource.setStatus(status);
        return mapToDto(resourceRepository.save(resource));
    }

    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException(id);
        }
        resourceRepository.deleteById(id);
    }

    // ── Mapper ────────────────────────────────────────────────
    private ResourceResponseDto mapToDto(Resource resource) {
        return ResourceResponseDto.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .description(resource.getDescription())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}