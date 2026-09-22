package ru.kingsname.crm.framework.security.core.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * High-Security 8-Digit Access Code Verification & JWT Token Engine
 */
@Slf4j
@Service
public class AccessCodeSecurityService {

    @Value("${kingsname.security.jwt.secret}")
    private String jwtSecret;

    @Value("${kingsname.security.jwt.expiration-seconds:86400}")
    private long expirationSeconds;

    @Value("${kingsname.security.code.default-master-code:88888888}")
    private String defaultMasterCode;

    @Value("${kingsname.security.code.max-failed-attempts:3}")
    private int maxFailedAttempts;

    @Value("${kingsname.security.code.lockout-minutes:15}")
    private int lockoutMinutes;

    // In-memory rate limiting and brute force tracker (IP / Code -> Failed Attempts & Lock Time)
    private final Map<String, Integer> failedAttemptsTracker = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lockTracker = new ConcurrentHashMap<>();

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Checks if a client IP or code is currently locked out
     */
    public boolean isLocked(String key) {
        LocalDateTime lockedUntil = lockTracker.get(key);
        if (lockedUntil == null) {
            return false;
        }
        if (LocalDateTime.now().isBefore(lockedUntil)) {
            return true;
        }
        // Lock expired
        lockTracker.remove(key);
        failedAttemptsTracker.remove(key);
        return false;
    }

    /**
     * Returns remaining lock time in minutes
     */
    public long getRemainingLockMinutes(String key) {
        LocalDateTime lockedUntil = lockTracker.get(key);
        if (lockedUntil == null || LocalDateTime.now().isAfter(lockedUntil)) {
            return 0;
        }
        return java.time.Duration.between(LocalDateTime.now(), lockedUntil).toMinutes() + 1;
    }

    /**
     * Records a failed attempt. If >= maxFailedAttempts, triggers lockout.
     */
    public int recordFailedAttempt(String key) {
        int attempts = failedAttemptsTracker.getOrDefault(key, 0) + 1;
        failedAttemptsTracker.put(key, attempts);
        if (attempts >= maxFailedAttempts) {
            lockTracker.put(key, LocalDateTime.now().plusMinutes(lockoutMinutes));
            log.warn("🚨 [SECURITY ALERT] 3 failed access code attempts detected for: {}. Locked for {} minutes!", key, lockoutMinutes);
        }
        return attempts;
    }

    /**
     * Resets failed attempts after successful authentication
     */
    public void resetFailedAttempts(String key) {
        failedAttemptsTracker.remove(key);
        lockTracker.remove(key);
    }

    /**
     * Generates a signed JWT for the authenticated employee session
     */
    public String generateToken(String code, String userName, String roleCode) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (expirationSeconds * 1000));

        return Jwts.builder()
                .subject(code)
                .claim("userName", userName)
                .claim("roleCode", roleCode)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates JWT token and extracts claims
     */
    public Claims parseToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return null;
        }
    }

    public String getDefaultMasterCode() {
        return defaultMasterCode;
    }
}
