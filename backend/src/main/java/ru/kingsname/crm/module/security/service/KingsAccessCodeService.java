package ru.kingsname.crm.module.security.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.framework.security.core.service.AccessCodeSecurityService;
import ru.kingsname.crm.module.security.dal.dataobject.KingsAccessCodeDO;
import ru.kingsname.crm.module.security.dal.dataobject.SysLoginLogDO;
import ru.kingsname.crm.module.security.dal.mysql.KingsAccessCodeMapper;
import ru.kingsname.crm.module.security.dal.mysql.SysLoginLogMapper;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Service managing 8-Digit Access Code security and lifecycle
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KingsAccessCodeService {

    private final KingsAccessCodeMapper accessCodeMapper;
    private final SysLoginLogMapper loginLogMapper;
    private final AccessCodeSecurityService securityService;
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Authenticate employee by 8-digit secure digital code
     */
    @Transactional(rollbackFor = Exception.class)
    public CommonResult<Map<String, Object>> loginByCode(String code, String ip, String userAgent) {
        if (code == null || !code.matches("^\\d{8}$")) {
            return CommonResult.error(400, "Код безопасности должен состоять ровно из 8 цифр");
        }

        String trackingKey = ip + ":" + code;

        // 1. Check brute force lockout
        if (securityService.isLocked(trackingKey) || securityService.isLocked(ip)) {
            long remaining = securityService.getRemainingLockMinutes(trackingKey);
            logAttempt(code, "Unknown", "none", ip, userAgent, 2, "Превышен лимит попыток. Временная блокировка.");
            return CommonResult.error(429, "Доступ заблокирован после 3 неверных попыток. Повторите через " + (remaining > 0 ? remaining : 15) + " мин.");
        }

        // 2. Query code in database
        KingsAccessCodeDO codeDO = null;
        try {
            codeDO = accessCodeMapper.selectOne(
                    new LambdaQueryWrapper<KingsAccessCodeDO>()
                            .eq(KingsAccessCodeDO::getCode, code)
                            .eq(KingsAccessCodeDO::getStatus, 0)
            );
        } catch (Exception e) {
            log.error("Database query failed during code authentication: {}", e.getMessage());
        }

        // Fallback for Master Admin Code 88888888 if DB is not yet populated
        if (codeDO == null && securityService.getDefaultMasterCode().equals(code)) {
            codeDO = new KingsAccessCodeDO();
            codeDO.setId(1L);
            codeDO.setCode(code);
            codeDO.setUserId(1L);
            codeDO.setUserName("Шеф-Администратор KINGSNAME");
            codeDO.setRoleCode("admin");
            codeDO.setStatus(0);
        }

        // 3. Validation failure handling
        if (codeDO == null) {
            int attempts = securityService.recordFailedAttempt(trackingKey);
            securityService.recordFailedAttempt(ip);
            logAttempt(code, "Unknown", "none", ip, userAgent, 0, "Неверный код безопасности");

            int remainingAttempts = Math.max(0, 3 - attempts);
            if (remainingAttempts == 0) {
                return CommonResult.error(429, "Неверный код. Превышен лимит! Система заблокирована на 15 минут.");
            }
            return CommonResult.error(401, "Неверный код доступа. Осталось попыток: " + remainingAttempts);
        }

        // 4. Check expiration
        if (codeDO.getExpireTime() != null && LocalDateTime.now().isAfter(codeDO.getExpireTime())) {
            logAttempt(code, codeDO.getUserName(), codeDO.getRoleCode(), ip, userAgent, 0, "Срок действия кода истек");
            return CommonResult.error(401, "Срок действия 8-значного кода истек. Обратитесь к Администратору.");
        }

        // 5. Authentication success
        securityService.resetFailedAttempts(trackingKey);
        securityService.resetFailedAttempts(ip);

        String token = securityService.generateToken(codeDO.getCode(), codeDO.getUserName(), codeDO.getRoleCode());
        logAttempt(code, codeDO.getUserName(), codeDO.getRoleCode(), ip, userAgent, 1, "Успешный вход в CRM");

        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("userId", codeDO.getUserId());
        data.put("userName", codeDO.getUserName());
        data.put("roleCode", codeDO.getRoleCode());
        data.put("code", codeDO.getCode());

        return CommonResult.success(data);
    }

    /**
     * Generate new 8-digit access code for an employee
     */
    @Transactional(rollbackFor = Exception.class)
    public KingsAccessCodeDO generateCode(String userName, String roleCode, Integer validType, String creator) {
        String code;
        do {
            int num = 10000000 + secureRandom.nextInt(90000000);
            code = String.valueOf(num);
        } while (accessCodeMapper.selectCount(new LambdaQueryWrapper<KingsAccessCodeDO>().eq(KingsAccessCodeDO::getCode, code)) > 0);

        KingsAccessCodeDO entity = new KingsAccessCodeDO();
        entity.setCode(code);
        entity.setUserId(System.currentTimeMillis() % 100000);
        entity.setUserName(userName);
        entity.setRoleCode(roleCode != null ? roleCode : "consultant");
        entity.setValidType(validType != null ? validType : 1);
        entity.setStatus(0);
        entity.setFailedAttempts(0);
        entity.setCreator(creator);

        // Calculate expiration: 1 = Shift (12h), 2 = 1 Day (24h), 3 = Permanent (null)
        if (entity.getValidType() == 1) {
            entity.setExpireTime(LocalDateTime.now().plusHours(12));
        } else if (entity.getValidType() == 2) {
            entity.setExpireTime(LocalDateTime.now().plusHours(24));
        } else {
            entity.setExpireTime(null);
        }

        accessCodeMapper.insert(entity);
        return entity;
    }

    /**
     * Page list of access codes
     */
    public PageResult<KingsAccessCodeDO> getCodePage(int pageNo, int pageSize) {
        Page<KingsAccessCodeDO> page = new Page<>(pageNo, pageSize);
        accessCodeMapper.selectPage(page, new LambdaQueryWrapper<KingsAccessCodeDO>().orderByDesc(KingsAccessCodeDO::getId));
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    /**
     * Revoke / deactivate access code
     */
    public void revokeCode(Long id, String updater) {
        KingsAccessCodeDO code = accessCodeMapper.selectById(id);
        if (code != null) {
            code.setStatus(1);
            code.setUpdater(updater);
            accessCodeMapper.updateById(code);
        }
    }

    /**
     * Page list of security audit logs
     */
    public PageResult<SysLoginLogDO> getLoginLogs(int pageNo, int pageSize) {
        Page<SysLoginLogDO> page = new Page<>(pageNo, pageSize);
        loginLogMapper.selectPage(page, new LambdaQueryWrapper<SysLoginLogDO>().orderByDesc(SysLoginLogDO::getId));
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    private void logAttempt(String code, String userName, String roleCode, String ip, String userAgent, int status, String msg) {
        try {
            SysLoginLogDO logDO = new SysLoginLogDO();
            logDO.setCode(code != null ? code : "--------");
            logDO.setUserName(userName);
            logDO.setRoleCode(roleCode);
            logDO.setIp(ip != null ? ip : "127.0.0.1");
            logDO.setUserAgent(userAgent != null && userAgent.length() > 250 ? userAgent.substring(0, 250) : userAgent);
            logDO.setResultStatus(status);
            logDO.setResultMsg(msg);
            logDO.setLoginTime(LocalDateTime.now());
            loginLogMapper.insert(logDO);
        } catch (Exception e) {
            log.warn("Could not insert login log into database: {}", e.getMessage());
        }
    }
}
