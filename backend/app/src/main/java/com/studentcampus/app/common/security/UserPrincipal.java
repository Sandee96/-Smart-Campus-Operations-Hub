package com.studentcampus.app.common.security;

import com.studentcampus.app.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private String id;
    private String email;
    private String name;       // ✅ from JWT claim
    private String picture;    // ✅ from JWT claim
    private Set<User.Role> roles;
    private Collection<? extends GrantedAuthority> authorities;

    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return null; }

    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}