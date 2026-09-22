package ru.kingsname.crm.module.client.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.client.dal.dataobject.KingsClientDO;
import ru.kingsname.crm.module.client.dal.mysql.KingsClientMapper;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for KINGSNAME Client relationship operations
 */
@Service
@RequiredArgsConstructor
public class KingsClientService {

    private final KingsClientMapper clientMapper;

    public PageResult<KingsClientDO> getClientPage(int pageNo, int pageSize, String search, String city) {
        Page<KingsClientDO> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<KingsClientDO> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(search)) {
            wrapper.and(w -> w.like(KingsClientDO::getName, search)
                    .or().like(KingsClientDO::getPhone, search)
                    .or().like(KingsClientDO::getInstagram, search));
        }
        if (StringUtils.hasText(city)) {
            wrapper.eq(KingsClientDO::getCity, city);
        }

        wrapper.orderByDesc(KingsClientDO::getId);
        clientMapper.selectPage(page, wrapper);
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    public List<KingsClientDO> getAllClients() {
        return clientMapper.selectList(new LambdaQueryWrapper<KingsClientDO>().orderByDesc(KingsClientDO::getTotalSpent));
    }

    public KingsClientDO getClient(Long id) {
        return clientMapper.selectById(id);
    }

    public KingsClientDO createClient(KingsClientDO client, String creator) {
        if (client.getTotalSpent() == null) {
            client.setTotalSpent(BigDecimal.ZERO);
        }
        if (client.getVipLevel() == null) {
            client.setVipLevel(1);
        }
        client.setCreator(creator);
        clientMapper.insert(client);
        return client;
    }

    public void updateClient(KingsClientDO client, String updater) {
        client.setUpdater(updater);
        clientMapper.updateById(client);
    }

    public void deleteClient(Long id) {
        clientMapper.deleteById(id);
    }
}
