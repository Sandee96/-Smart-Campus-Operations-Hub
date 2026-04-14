package com.studentcampus.app.repository;

import com.studentcampus.app.model.Resource;
import com.studentcampus.app.model.ResourceStatus;
import com.studentcampus.app.model.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(ResourceType type);

    List<Resource> findByStatus(ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByCapacityGreaterThanEqual(Integer capacity);

    // Combined filter query
    @Query("{ $and: [ " +
           "  { $or: [ { 'type': ?0 }, { $expr: { $eq: [?0, null] } } ] }, " +
           "  { $or: [ { 'capacity': { $gte: ?1 } }, { $expr: { $eq: [?1, null] } } ] }, " +
           "  { $or: [ { 'location': { $regex: ?2, $options: 'i' } }, { $expr: { $eq: [?2, null] } } ] }, " +
           "  { $or: [ { 'status': ?3 }, { $expr: { $eq: [?3, null] } } ] } " +
           "] }")
    List<Resource> findByFilters(ResourceType type, Integer minCapacity, String location, ResourceStatus status);
}
