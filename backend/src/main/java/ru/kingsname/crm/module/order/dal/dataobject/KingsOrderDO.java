package ru.kingsname.crm.module.order.dal.dataobject;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import ru.kingsname.crm.framework.common.pojo.BaseDO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * KINGSNAME Bespoke & RTW Orders Data Object
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("kings_order")
public class KingsOrderDO extends BaseDO {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * Unique order code, e.g. KN-202609-001
     */
    private String orderNo;

    private Long clientId;
    private String clientName;
    private String clientPhone;

    /**
     * INSTAGRAM (@kingsname), WEBSITE (kingsname.store), SALON_GROZNY, PHONE
     */
    private String channel;

    /**
     * Костюм-тройка, Костюм-двойка, Смокинг, Пальто, Сорочка, etc.
     */
    private String productType;

    /**
     * BESPOKE (индивидуальный пошив) or RTW (готовый размер)
     */
    private String orderType;

    /**
     * 6-Stage Funnel Status:
     * LEAD, APPOINTMENT, FITTING, PAYMENT_AGREED, TAILORING, DELIVERED, CANCELLED
     */
    private String status;

    // --- Anatomical Bespoke Measurements ---
    private Integer height;
    private BigDecimal chest;
    private BigDecimal waist;
    private BigDecimal hips;
    private BigDecimal shoulderWidth;
    private BigDecimal sleeveLength;
    private BigDecimal trouserLength;

    // --- Customization & Tailoring Attributes ---
    private String fabricBrand;
    private String fabricSku;
    private String fabricColor;
    private String lapelType;
    private String fitType;
    private String monogram;
    private String buttonType;
    private String tailorNotes;

    // --- Financials ---
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private BigDecimal balanceAmount;
    private String paymentMethod;

    /**
     * PENDING, PARTIAL, PAID
     */
    private String paymentStatus;

    private LocalDateTime appointmentDate;
    private LocalDate targetCompletionDate;
    private LocalDateTime deliveryDate;
}
