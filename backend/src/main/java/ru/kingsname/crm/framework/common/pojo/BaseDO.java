package ru.kingsname.crm.framework.common.pojo;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base Data Object strictly following ruoyi-vue-pro BaseDO conventions
 */
@Data
public abstract class BaseDO implements Serializable {

    /**
     * Creation time
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * Last update time
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * Creator employee code / username
     */
    @TableField(fill = FieldFill.INSERT)
    private String creator;

    /**
     * Updater employee code / username
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String updater;

    /**
     * Logical soft delete flag (0 = active, 1 = deleted)
     */
    @TableLogic
    private Boolean deleted;
}
