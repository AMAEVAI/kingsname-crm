package ru.kingsname.crm.module.security.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kingsname.crm.framework.common.pojo.BaseDO;

import java.time.LocalDateTime;

/**
 * 8-Digit Access Code Data Object
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("sys_access_code")
public class KingsAccessCodeDO extends BaseDO {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 8-digit secure code
     */
    private String code;

    /**
     * User / employee ID
     */
    private Long userId;

    /**
     * Employee name
     */
    private String userName;

    /**
     * Role code: admin, consultant, tailor, manager
     */
    private String roleCode;

    /**
     * 1 = Shift (8-12h), 2 = 1 Day (24h), 3 = Permanent
     */
    private Integer validType;

    /**
     * Expiration time (null for permanent)
     */
    private LocalDateTime expireTime;

    /**
     * 0 = Active, 1 = Revoked, 2 = Locked
     */
    private Integer status;

    /**
     * Failed attempts counter
     */
    private Integer failedAttempts;

    /**
     * Temporary lockout time if failed_attempts >= 3
     */
    private LocalDateTime lockedUntil;
}
