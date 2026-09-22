package ru.kingsname.crm.module.inventory.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kingsname.crm.framework.common.pojo.BaseDO;

import java.math.BigDecimal;

/**
 * KINGSNAME Warehouse Inventory & Fabrics Data Object
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("kings_inventory")
public class KingsInventoryDO extends BaseDO {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * SUIT, JACKET, TROUSERS, SHIRT, FABRIC, ACCESSORY
     */
    private String itemType;

    private String sku;
    private String name;

    /**
     * 46, 48, 50, 52, 54, 56, 58, 60, 62
     */
    private String size;

    /**
     * 170-176, 176-182, 182-188, 188+
     */
    private String heightCategory;

    private String color;
    private Integer stockQuantity;
    private String unit;

    /**
     * Critical stock threshold alert level
     */
    private Integer minThreshold;

    private BigDecimal price;

    public boolean isLowStock() {
        return stockQuantity != null && minThreshold != null && stockQuantity <= minThreshold;
    }
}
