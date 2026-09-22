package ru.kingsname.crm.module.security.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Access Code Login Audit Log Data Object
 */
@Data
@TableName("sys_login_log")
public class SysLoginLogDO implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String code;
    private String userName;
    private String roleCode;
    private String ip;
    private String userAgent;

    /**
     * 1 = Success, 0 = Failed, 2 = Blocked
     */
    private Integer resultStatus;
    private String resultMsg;
    private LocalDateTime loginTime;
}
