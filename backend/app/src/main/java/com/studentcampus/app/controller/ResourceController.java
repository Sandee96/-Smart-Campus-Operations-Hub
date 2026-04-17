package com.studentcampus.app.controller;

import com.studentcampus.app.dto.ResourceRequestDto;
import com.studentcampus.app.dto.ResourceResponseDto;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import com.studentcampus.app.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor

public class ResourceController {

    private final ResourceService resourceService;

    // ── POST /api/resources  (ADMIN) ──────────────────────
    @PostMapping
    public ResponseEntity<ResourceResponseDto> createResource(
            @Valid @RequestBody ResourceRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(resourceService.createResource(dto));
    }

    // ── GET /api/resources  (public / USER) ───────────────
    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // ── GET /api/resources/search  (public / USER) ────────
    // e.g. /api/resources/search?type=LAB&minCapacity=20&location=Block+A&status=ACTIVE
    @GetMapping("/search")
    public ResponseEntity<List<ResourceResponseDto>> searchResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status) {
        return ResponseEntity.ok(
                resourceService.searchResources(type, minCapacity, location, status));
    }

    // ── GET /api/resources/{id}  (public / USER) ──────────
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable String id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // ── PUT /api/resources/{id}  (ADMIN) ──────────────────
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> updateResource(
            @PathVariable String id,
            @Valid @RequestBody ResourceRequestDto dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }

    // ── PATCH /api/resources/{id}/status  (ADMIN) ─────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<ResourceResponseDto> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        ResourceStatus status = ResourceStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(resourceService.updateResourceStatus(id, status));
    }

    // ── DELETE /api/resources/{id}  (ADMIN) ───────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}