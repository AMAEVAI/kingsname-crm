package ru.kingsname.crm.module.security.dal.mysql;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import ru.kingsname.crm.module.security.dal.dataobject.SysLoginLogDO;

@Mapper
public interface SysLoginLogMapper extends BaseMapper<SysLoginLogDO> {
}
