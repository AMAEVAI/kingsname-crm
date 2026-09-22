package ru.kingsname.crm.module.inventory.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.inventory.dal.dataobject.KingsInventoryDO;
import ru.kingsname.crm.module.inventory.service.KingsInventoryService;

import java.util.List;

/**
 * Controller for Managing Suits, RTW Sizes & Fabrics Inventory
 */
@RestController
@RequestMapping("/admin-api/kings/inventory")
@RequiredArgsConstructor
public class KingsInventoryController {

    private final KingsInventoryService inventoryService;

    @Data
    public static class UpdateStockReq {
        private Long id;
        private Integer delta;
    }

    @GetMapping("/page")
    public CommonResult<PageResult<KingsInventoryDO>> getPage(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String itemType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean lowStockOnly) {
        return CommonResult.success(inventoryService.getInventoryPage(pageNo, pageSize, itemType, search, lowStockOnly));
    }

    @GetMapping("/list-all")
    public CommonResult<List<KingsInventoryDO>> listAll() {
        return CommonResult.success(inventoryService.getAllInventory());
    }

    @PostMapping("/save")
    public CommonResult<KingsInventoryDO> save(@RequestBody KingsInventoryDO item, Authentication auth) {
        String user = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        return CommonResult.success(inventoryService.saveItem(item, user));
    }

    @PostMapping("/update-stock")
    public CommonResult<Boolean> updateStock(@RequestBody UpdateStockReq req, Authentication auth) {
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        inventoryService.updateStock(req.getId(), req.getDelta() != null ? req.getDelta() : 0, updater);
        return CommonResult.success(true);
    }

    @DeleteMapping("/delete")
    public CommonResult<Boolean> delete(@RequestParam Long id) {
        inventoryService.deleteItem(id);
        return CommonResult.success(true);
    }
}
