package ru.kingsname.crm.module.client.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kingsname.crm.framework.common.pojo.BaseDO;

import java.math.BigDecimal;

/**
 * KINGSNAME VIP Client Data Object
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("kings_client")
public class KingsClientDO extends BaseDO {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;
    private String phone;
    private String city;

    /**
     * Instagram username (e.g. @abubakar_k)
     */
    private String instagram;

    /**
     * 1 = Classic VIP, 2 = Gold VIP, 3 = Bespoke Club Elite
     */
    private Integer vipLevel;

    /**
     * Cumulative rubles spent
     */
    private BigDecimal totalSpent;

    private String notes;
}
