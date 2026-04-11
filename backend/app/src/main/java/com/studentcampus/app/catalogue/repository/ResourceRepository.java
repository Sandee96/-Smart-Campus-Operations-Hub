package com.studentcampus.app.catalogue.repository;

import com.studentcampus.app.catalogue.model.Resource;
import com.studentcampus.app.catalogue.model.ResourceStatus;
import com.studentcampus.app.catalogue.model.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    // Find by type (e.g., LAB, EQUIPMENT)
    List<Resource> findByType(ResourceType type);

    // Find by status (e.g., ACTIVE)
    List<Resource> findByStatus(ResourceStatus status);

    // Find by location
    List<Resource> findByLocationContainingIgnoreCase(String location);

    // Find by type and status
    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);

    // Find by minimum capacity
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    // Search by name
    List<Resource> findByNameContainingIgnoreCase(String name);
}