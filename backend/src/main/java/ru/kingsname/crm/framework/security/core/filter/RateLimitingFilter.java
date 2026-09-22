package ru.kingsname.crm.framework.security.core.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.kingsname.crm.framework.common.pojo.CommonResult;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * L7 Anti-DDoS & IP Rate Limiting Filter
 * Protects CRM endpoints against automated HTTP flood attacks and rapid brute-force attempts.
 */
@Slf4j
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_AUTH_REQUESTS_PER_MINUTE = 30;
    private static final int MAX_GENERAL_REQUESTS_PER_MINUTE = 300;
    private static final long WINDOW_MS = 60_000L;

    private static class WindowCounter {
        long windowStart;
        AtomicInteger count;

        WindowCounter(long start) {
            this.windowStart = start;
            this.count = new AtomicInteger(1);
        }
    }

    private final Map<String, WindowCounter> authRateMap = new ConcurrentHashMap<>();
    private final Map<String, WindowCounter> generalRateMap = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String clientIp = getClientIp(request);
        String uri = request.getRequestURI();
        long now = System.currentTimeMillis();

        // 1. Specific rate limit for sensitive authentication / login endpoints
        if (uri.contains("/kings/auth/login-by-code")) {
            if (!isAllowed(authRateMap, clientIp, MAX_AUTH_REQUESTS_PER_MINUTE, now)) {
                log.warn("🚨 [DDoS DEFENSE] Auth rate limit exceeded for IP: {}. Blocking request.", clientIp);
                rejectTooManyRequests(response, "Превышен лимит запросов аутентификации (Anti-DDoS). Пожалуйста, повторите через минуту.");
                return;
            }
        } else {
            // 2. General rate limit for all other CRM endpoints
            if (!isAllowed(generalRateMap, clientIp, MAX_GENERAL_REQUESTS_PER_MINUTE, now)) {
                log.warn("🚨 [DDoS DEFENSE] General rate limit exceeded for IP: {}. Blocking request.", clientIp);
                rejectTooManyRequests(response, "Превышен общий лимит запросов к серверу (Anti-DDoS). Подождите одну минуту.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAllowed(Map<String, WindowCounter> map, String ip, int maxRequests, long now) {
        WindowCounter counter = map.compute(ip, (key, existing) -> {
            if (existing == null || now - existing.windowStart >= WINDOW_MS) {
                return new WindowCounter(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        // Periodic light cleanup when map grows
        if (map.size() > 5000) {
            map.entrySet().removeIf(entry -> now - entry.getValue().windowStart > WINDOW_MS * 2);
        }

        return counter.count.get() <= maxRequests;
    }

    private void rejectTooManyRequests(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        CommonResult<Object> result = CommonResult.error(429, message);
        response.getWriter().write(objectMapper.writeValueAsString(result));
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip != null && ip.contains(",") ? ip.split(",")[0].trim() : ip;
    }
}
