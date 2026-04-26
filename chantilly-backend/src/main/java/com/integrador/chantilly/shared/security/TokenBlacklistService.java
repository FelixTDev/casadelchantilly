package com.integrador.chantilly.shared.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlacklistService {

    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    public void blacklistToken(String token, Date expiresAt) {
        if (token == null || token.isBlank()) {
            return;
        }
        Instant expiry = expiresAt != null ? expiresAt.toInstant() : Instant.now().plusSeconds(3600);
        blacklistedTokens.put(token, expiry);
    }

    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) {
            return false;
        }
        cleanupExpired();
        Instant expiresAt = blacklistedTokens.get(token);
        return expiresAt != null && expiresAt.isAfter(Instant.now());
    }

    private void cleanupExpired() {
        Instant now = Instant.now();
        blacklistedTokens.entrySet().removeIf(entry -> !entry.getValue().isAfter(now));
    }
}
