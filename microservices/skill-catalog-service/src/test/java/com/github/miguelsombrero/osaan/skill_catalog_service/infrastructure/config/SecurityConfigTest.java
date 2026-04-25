package com.github.miguelsombrero.osaan.skill_catalog_service.infrastructure.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

class SecurityConfigTest {

    private final SecurityConfig securityConfig = new SecurityConfig();

    @Test
    void jwtConverter_extractsRolesFromRealmAccessAndPrefixesWithROLE() {
        Jwt jwt = buildJwt(Map.of("realm_access", Map.of("roles", List.of("user", "admin"))));

        List<String> roles = extractRoles(securityConfig.jwtAuthenticationConverter(), jwt);

        assertThat(roles).containsExactlyInAnyOrder("ROLE_user", "ROLE_admin");
    }

    @Test
    void jwtConverter_nullRealmAccess_returnsEmptyAuthorities() {
        Jwt jwt = buildJwt(Map.of());

        List<String> roles = extractRoles(securityConfig.jwtAuthenticationConverter(), jwt);

        assertThat(roles).isEmpty();
    }

    @Test
    void jwtConverter_rolesIsNotACollection_returnsEmptyAuthorities() {
        Jwt jwt = buildJwt(Map.of("realm_access", Map.of("roles", "not-a-list")));

        List<String> roles = extractRoles(securityConfig.jwtAuthenticationConverter(), jwt);

        assertThat(roles).isEmpty();
    }

    @Test
    void jwtConverter_emptyRolesList_returnsEmptyAuthorities() {
        Jwt jwt = buildJwt(Map.of("realm_access", Map.of("roles", List.of())));

        List<String> roles = extractRoles(securityConfig.jwtAuthenticationConverter(), jwt);

        assertThat(roles).isEmpty();
    }

    @Test
    void roleHierarchy_adminImpliesManagerAndUser() {
        RoleHierarchy hierarchy = SecurityConfig.roleHierarchy();

        List<String> reachable = reachableRoles(hierarchy, "ROLE_ADMIN");

        assertThat(reachable).containsExactlyInAnyOrder("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_USER");
    }

    @Test
    void roleHierarchy_managerImpliesUser() {
        RoleHierarchy hierarchy = SecurityConfig.roleHierarchy();

        List<String> reachable = reachableRoles(hierarchy, "ROLE_MANAGER");

        assertThat(reachable)
                .containsExactlyInAnyOrder("ROLE_MANAGER", "ROLE_USER")
                .doesNotContain("ROLE_ADMIN");
    }

    @Test
    void roleHierarchy_userHasNoImpliedRoles() {
        RoleHierarchy hierarchy = SecurityConfig.roleHierarchy();

        List<String> reachable = reachableRoles(hierarchy, "ROLE_USER");

        assertThat(reachable).containsExactly("ROLE_USER");
    }

    private static Jwt buildJwt(Map<String, Object> claims) {
        return Jwt.withTokenValue("mock-token")
                .header("alg", "RS256")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .claims(c -> c.putAll(claims))
                .build();
    }

    @SuppressWarnings("unchecked")
    private static List<String> extractRoles(JwtAuthenticationConverter converter, Jwt jwt) {
        Collection<GrantedAuthority> all = (Collection<GrantedAuthority>) converter.convert(jwt).getAuthorities();
        // Filter out non-role authorities (e.g. FactorGrantedAuthority added by Spring Security 6.5+)
        return all.stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .toList();
    }

    private static List<String> reachableRoles(RoleHierarchy hierarchy, String role) {
        return hierarchy.getReachableGrantedAuthorities(Set.of(new SimpleGrantedAuthority(role)))
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }
}
