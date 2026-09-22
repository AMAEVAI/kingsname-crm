package ru.kingsname.crm.framework.security.core.token;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom Spring Security Authentication Token for KINGSNAME 8-Digit Access Code
 */
public class AccessCodeAuthenticationToken extends AbstractAuthenticationToken {

    private final String code;
    private final Object principal; // Employee info / username

    public AccessCodeAuthenticationToken(String code) {
        super(null);
        this.code = code;
        this.principal = code;
        setAuthenticated(false);
    }

    public AccessCodeAuthenticationToken(Object principal, String code, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.code = code;
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return this.code;
    }

    @Override
    public Object getPrincipal() {
        return this.principal;
    }
}
