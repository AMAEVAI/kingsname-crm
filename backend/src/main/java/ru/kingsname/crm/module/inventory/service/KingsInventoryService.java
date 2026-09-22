package ru.kingsname.crm.module.inventory.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.inventory.dal.dataobject.KingsInventoryDO;
import ru.kingsname.crm.module.inventory.dal.mysql.KingsInventoryMapper;

import java.util.List;

/**
 * Service for Managing Sartorial Suits, Sizes and Fabrics Inventory
 */
@Service
@RequiredArgsConstructor
public class KingsInventoryService {

    private final KingsInventoryMapper inventoryMapper;

    public PageResult<KingsInventoryDO> getInventoryPage(int pageNo, int pageSize, String itemType, String search, Boolean lowStockOnly) {
        Page<KingsInventoryDO> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<KingsInventoryDO> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(itemType)) {
            wrapper.eq(KingsInventoryDO::getItemType, itemType);
        }
        if (StringUtils.hasText(search)) {
            wrapper.and(w -> w.like(KingsInventoryDO::getName, search)
                    .or().like(KingsInventoryDO::getSku, search)
                    .or().like(KingsInventoryDO::getColor, search));
        }
        if (Boolean.TRUE.equals(lowStockOnly)) {
            wrapper.apply("stock_quantity <= min_threshold");
        }

        wrapper.orderByDesc(KingsInventoryDO::getId);
        inventoryMapper.selectPage(page, wrapper);
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    public List<KingsInventoryDO> getAllInventory() {
        return inventoryMapper.selectList(new LambdaQueryWrapper<KingsInventoryDO>().orderByDesc(KingsInventoryDO::getId));
    }

    public KingsInventoryDO saveItem(KingsInventoryDO item, String user) {
        if (item.getId() == null) {
            item.setCreator(user);
            inventoryMapper.insert(item);
        } else {
            item.setUpdater(user);
            inventoryMapper.updateById(item);
        }
        return item;
    }

    public void updateStock(Long id, int delta, String updater) {
        KingsInventoryDO item = inventoryMapper.selectById(id);
        if (item != null) {
            item.setStockQuantity(Math.max(0, item.getStockQuantity() + delta));
            item.setUpdater(updater);
            inventoryMapper.updateById(item);
        }
    }

    public void deleteItem(Long id) {
        inventoryMapper.deleteById(id);
    }
}
