package ru.kingsname.crm.framework.security.core.filter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.kingsname.crm.framework.security.core.service.AccessCodeSecurityService;
import ru.kingsname.crm.framework.security.core.token.AccessCodeAuthenticationToken;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * Filter checking Bearer token issued for KINGSNAME 8-Digit Access Code
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AccessCodeAuthenticationFilter extends OncePerRequestFilter {

    private final AccessCodeSecurityService securityService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (StringUtils.hasText(token)) {
            Claims claims = securityService.parseToken(token);
            if (claims != null) {
                String code = claims.getSubject();
                String userName = claims.get("userName", String.class);
                String roleCode = claims.get("roleCode", String.class);

                List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + (roleCode != null ? roleCode.toUpperCase() : "CONSULTANT"))
                );

                AccessCodeAuthenticationToken authentication = new AccessCodeAuthenticationToken(
                        userName, code, authorities
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7).trim();
        }
        return null;
    }
}
