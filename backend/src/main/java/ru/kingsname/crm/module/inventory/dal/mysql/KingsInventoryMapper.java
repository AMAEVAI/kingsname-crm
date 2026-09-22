package ru.kingsname.crm.module.inventory.dal.mysql;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import ru.kingsname.crm.module.inventory.dal.dataobject.KingsInventoryDO;

@Mapper
public interface KingsInventoryMapper extends BaseMapper<KingsInventoryDO> {
}
