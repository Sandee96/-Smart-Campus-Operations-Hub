package com.studentcampus.app.dto;

import com.studentcampus.app.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class RoleUpdateRequestDTO {

    @NotNull(message = "Roles must not be null")
    private Set<User.Role> roles;
}