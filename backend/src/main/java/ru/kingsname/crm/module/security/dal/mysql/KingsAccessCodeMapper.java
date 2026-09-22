package ru.kingsname.crm.module.security.dal.mysql;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import ru.kingsname.crm.module.security.dal.dataobject.KingsAccessCodeDO;

@Mapper
public interface KingsAccessCodeMapper extends BaseMapper<KingsAccessCodeDO> {
}
