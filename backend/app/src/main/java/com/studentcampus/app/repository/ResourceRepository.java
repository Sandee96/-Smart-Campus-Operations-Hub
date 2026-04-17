package com.studentcampus.app.repository;

import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(ResourceType type);
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);
}