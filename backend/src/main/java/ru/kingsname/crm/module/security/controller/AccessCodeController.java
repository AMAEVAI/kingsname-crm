package ru.kingsname.crm.module.security.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.security.dal.dataobject.KingsAccessCodeDO;
import ru.kingsname.crm.module.security.dal.dataobject.SysLoginLogDO;
import ru.kingsname.crm.module.security.service.KingsAccessCodeService;

import java.util.Map;

/**
 * Controller for KINGSNAME 8-Digit Access Code Security & Authentication
 * Hardened with Role-Based Access Control (Admin-only code generation & log inspection)
 */
@RestController
@RequestMapping("/admin-api/kings")
@RequiredArgsConstructor
public class AccessCodeController {

    private final KingsAccessCodeService accessCodeService;

    @Data
    public static class LoginReq {
        private String code;
    }

    @Data
    public static class GenerateCodeReq {
        private String userName;
        private String roleCode;
        private Integer validType;
    }

    @Data
    public static class RevokeCodeReq {
        private Long id;
    }

    /**
     * 1. Core 8-Digit Code Login Endpoint
     */
    @PostMapping("/auth/login-by-code")
    public CommonResult<Map<String, Object>> loginByCode(@RequestBody LoginReq req, HttpServletRequest request) {
        String clientIp = getClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        return accessCodeService.loginByCode(req != null ? req.getCode() : null, clientIp, userAgent);
    }

    /**
     * 2. Check current session status
     */
    @GetMapping("/auth/status")
    public CommonResult<String> status() {
        return CommonResult.success("KINGSNAME CRM Security Gateway Active");
    }

    /**
     * 3. Admin: Generate new 8-digit access code (Protected)
     */
    @PostMapping("/security/codes/generate")
    public CommonResult<KingsAccessCodeDO> generateCode(@RequestBody GenerateCodeReq req, Authentication auth) {
        if (!isAdmin(auth)) {
            return CommonResult.error(403, "Доступ запрещен: генерация кодов доступна только Администратору");
        }
        String creator = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        KingsAccessCodeDO created = accessCodeService.generateCode(
                req.getUserName(), req.getRoleCode(), req.getValidType(), creator
        );
        return CommonResult.success(created);
    }

    /**
     * 4. Admin: List access codes with pagination (Protected)
     */
    @GetMapping("/security/codes/page")
    public CommonResult<PageResult<KingsAccessCodeDO>> getCodePage(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return CommonResult.error(403, "Доступ запрещен: просмотр реестра кодов доступен только Администратору");
        }
        return CommonResult.success(accessCodeService.getCodePage(pageNo, pageSize));
    }

    /**
     * 5. Admin: Revoke / deactivate code (Protected)
     */
    @PostMapping("/security/codes/revoke")
    public CommonResult<Boolean> revokeCode(@RequestBody RevokeCodeReq req, Authentication auth) {
        if (!isAdmin(auth)) {
            return CommonResult.error(403, "Доступ запрещен: отзыв кодов доступен только Администратору");
        }
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        accessCodeService.revokeCode(req.getId(), updater);
        return CommonResult.success(true);
    }

    /**
     * 6. Admin: Audit logs of all authentication attempts (Protected)
     */
    @GetMapping("/security/logs/page")
    public CommonResult<PageResult<SysLoginLogDO>> getLoginLogs(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return CommonResult.error(403, "Доступ запрещен: просмотр логов безопасности доступен только Администратору");
        }
        return CommonResult.success(accessCodeService.getLoginLogs(pageNo, pageSize));
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equalsIgnoreCase(a.getAuthority()));
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
