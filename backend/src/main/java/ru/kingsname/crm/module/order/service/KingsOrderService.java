package ru.kingsname.crm.module.order.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.client.dal.dataobject.KingsClientDO;
import ru.kingsname.crm.module.client.dal.mysql.KingsClientMapper;
import ru.kingsname.crm.module.order.dal.dataobject.KingsOrderDO;
import ru.kingsname.crm.module.order.dal.mysql.KingsOrderMapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service for Managing KINGSNAME Orders and Bespoke Tailoring Funnel
 */
@Service
@RequiredArgsConstructor
public class KingsOrderService {

    private final KingsOrderMapper orderMapper;
    private final KingsClientMapper clientMapper;

    public PageResult<KingsOrderDO> getOrderPage(int pageNo, int pageSize, String status, String search, String channel) {
        Page<KingsOrderDO> page = new Page<>(pageNo, pageSize);
        LambdaQueryWrapper<KingsOrderDO> wrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(status)) {
            wrapper.eq(KingsOrderDO::getStatus, status);
        }
        if (StringUtils.hasText(channel)) {
            wrapper.eq(KingsOrderDO::getChannel, channel);
        }
        if (StringUtils.hasText(search)) {
            wrapper.and(w -> w.like(KingsOrderDO::getOrderNo, search)
                    .or().like(KingsOrderDO::getClientName, search)
                    .or().like(KingsOrderDO::getClientPhone, search)
                    .or().like(KingsOrderDO::getProductType, search));
        }

        wrapper.orderByDesc(KingsOrderDO::getId);
        orderMapper.selectPage(page, wrapper);
        return new PageResult<>(page.getRecords(), page.getTotal());
    }

    public List<KingsOrderDO> getAllOrders() {
        return orderMapper.selectList(new LambdaQueryWrapper<KingsOrderDO>().orderByDesc(KingsOrderDO::getId));
    }

    public KingsOrderDO getOrder(Long id) {
        return orderMapper.selectById(id);
    }

    @Transactional(rollbackFor = Exception.class)
    public KingsOrderDO createOrder(KingsOrderDO order, String creator) {
        // Generate Order No: KN-YYYYMM-XXXX
        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        long countToday = orderMapper.selectCount(new LambdaQueryWrapper<KingsOrderDO>()
                .likeRight(KingsOrderDO::getOrderNo, "KN-" + datePrefix)) + 1;
        order.setOrderNo(String.format("KN-%s-%03d", datePrefix, countToday));

        if (order.getStatus() == null) {
            order.setStatus("LEAD");
        }
        if (order.getOrderType() == null) {
            order.setOrderType("BESPOKE");
        }
        if (order.getDepositAmount() == null) {
            order.setDepositAmount(BigDecimal.ZERO);
        }
        if (order.getTotalAmount() == null) {
            order.setTotalAmount(BigDecimal.ZERO);
        }

        // Calculate balance
        BigDecimal balance = order.getTotalAmount().subtract(order.getDepositAmount());
        order.setBalanceAmount(balance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : balance);

        // Compute payment status
        if (order.getTotalAmount().compareTo(BigDecimal.ZERO) > 0 && order.getBalanceAmount().compareTo(BigDecimal.ZERO) == 0) {
            order.setPaymentStatus("PAID");
        } else if (order.getDepositAmount().compareTo(BigDecimal.ZERO) > 0) {
            order.setPaymentStatus("PARTIAL");
        } else {
            order.setPaymentStatus("PENDING");
        }

        order.setCreator(creator);
        orderMapper.insert(order);

        // Update client cumulative spent
        if (order.getClientId() != null && order.getDepositAmount().compareTo(BigDecimal.ZERO) > 0) {
            KingsClientDO client = clientMapper.selectById(order.getClientId());
            if (client != null) {
                client.setTotalSpent(client.getTotalSpent().add(order.getDepositAmount()));
                clientMapper.updateById(client);
            }
        }

        return order;
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateOrder(KingsOrderDO order, String updater) {
        if (order.getTotalAmount() != null && order.getDepositAmount() != null) {
            BigDecimal balance = order.getTotalAmount().subtract(order.getDepositAmount());
            order.setBalanceAmount(balance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : balance);

            if (order.getBalanceAmount().compareTo(BigDecimal.ZERO) == 0) {
                order.setPaymentStatus("PAID");
            } else if (order.getDepositAmount().compareTo(BigDecimal.ZERO) > 0) {
                order.setPaymentStatus("PARTIAL");
            } else {
                order.setPaymentStatus("PENDING");
            }
        }

        if ("DELIVERED".equals(order.getStatus()) && order.getDeliveryDate() == null) {
            order.setDeliveryDate(LocalDateTime.now());
        }

        order.setUpdater(updater);
        orderMapper.updateById(order);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateOrderStatus(Long orderId, String newStatus, String updater) {
        KingsOrderDO order = orderMapper.selectById(orderId);
        if (order != null) {
            order.setStatus(newStatus);
            if ("DELIVERED".equals(newStatus)) {
                order.setDeliveryDate(LocalDateTime.now());
                order.setBalanceAmount(BigDecimal.ZERO);
                order.setDepositAmount(order.getTotalAmount());
                order.setPaymentStatus("PAID");
            }
            order.setUpdater(updater);
            orderMapper.updateById(order);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void recordPayment(Long orderId, BigDecimal amount, String paymentMethod, String updater) {
        KingsOrderDO order = orderMapper.selectById(orderId);
        if (order != null && amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal newDeposit = order.getDepositAmount().add(amount);
            order.setDepositAmount(newDeposit);
            BigDecimal newBalance = order.getTotalAmount().subtract(newDeposit);
            order.setBalanceAmount(newBalance.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newBalance);

            if (order.getBalanceAmount().compareTo(BigDecimal.ZERO) == 0) {
                order.setPaymentStatus("PAID");
            } else {
                order.setPaymentStatus("PARTIAL");
            }

            if (StringUtils.hasText(paymentMethod)) {
                order.setPaymentMethod(paymentMethod);
            }

            order.setUpdater(updater);
            orderMapper.updateById(order);

            // Update client spend
            if (order.getClientId() != null) {
                KingsClientDO client = clientMapper.selectById(order.getClientId());
                if (client != null) {
                    client.setTotalSpent(client.getTotalSpent().add(amount));
                    clientMapper.updateById(client);
                }
            }
        }
    }

    public void deleteOrder(Long id) {
        orderMapper.deleteById(id);
    }
}
