package ru.kingsname.crm.module.order.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.order.dal.dataobject.KingsOrderDO;
import ru.kingsname.crm.module.order.service.KingsOrderService;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for Managing Orders, Bespoke Tailoring & Funnel States
 */
@RestController
@RequestMapping("/admin-api/kings/orders")
@RequiredArgsConstructor
public class KingsOrderController {

    private final KingsOrderService orderService;

    @Data
    public static class UpdateStatusReq {
        private Long orderId;
        private String newStatus;
    }

    @Data
    public static class RecordPaymentReq {
        private Long orderId;
        private BigDecimal amount;
        private String paymentMethod;
    }

    @GetMapping("/page")
    public CommonResult<PageResult<KingsOrderDO>> getPage(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String channel) {
        return CommonResult.success(orderService.getOrderPage(pageNo, pageSize, status, search, channel));
    }

    @GetMapping("/list-all")
    public CommonResult<List<KingsOrderDO>> listAll() {
        return CommonResult.success(orderService.getAllOrders());
    }

    @GetMapping("/get")
    public CommonResult<KingsOrderDO> get(@RequestParam Long id) {
        return CommonResult.success(orderService.getOrder(id));
    }

    @PostMapping("/create")
    public CommonResult<KingsOrderDO> create(@RequestBody KingsOrderDO order, Authentication auth) {
        String creator = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        return CommonResult.success(orderService.createOrder(order, creator));
    }

    @PutMapping("/update")
    public CommonResult<Boolean> update(@RequestBody KingsOrderDO order, Authentication auth) {
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        orderService.updateOrder(order, updater);
        return CommonResult.success(true);
    }

    @PostMapping("/update-status")
    public CommonResult<Boolean> updateStatus(@RequestBody UpdateStatusReq req, Authentication auth) {
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        orderService.updateOrderStatus(req.getOrderId(), req.getNewStatus(), updater);
        return CommonResult.success(true);
    }

    @PostMapping("/record-payment")
    public CommonResult<Boolean> recordPayment(@RequestBody RecordPaymentReq req, Authentication auth) {
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        orderService.recordPayment(req.getOrderId(), req.getAmount(), req.getPaymentMethod(), updater);
        return CommonResult.success(true);
    }

    @DeleteMapping("/delete")
    public CommonResult<Boolean> delete(@RequestParam Long id) {
        orderService.deleteOrder(id);
        return CommonResult.success(true);
    }
}
