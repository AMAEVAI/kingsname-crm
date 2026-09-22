package ru.kingsname.crm.module.client.dal.mysql;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import ru.kingsname.crm.module.client.dal.dataobject.KingsClientDO;

@Mapper
public interface KingsClientMapper extends BaseMapper<KingsClientDO> {
}
