package ru.kingsname.crm.module.order.dal.mysql;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import ru.kingsname.crm.module.order.dal.dataobject.KingsOrderDO;

@Mapper
public interface KingsOrderMapper extends BaseMapper<KingsOrderDO> {
}
