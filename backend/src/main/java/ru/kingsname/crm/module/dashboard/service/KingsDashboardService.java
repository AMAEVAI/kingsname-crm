package ru.kingsname.crm.module.dashboard.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.kingsname.crm.module.order.dal.dataobject.KingsOrderDO;
import ru.kingsname.crm.module.order.dal.mysql.KingsOrderMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Service calculating Executive Analytics and Bespoke Funnel Metrics
 */
@Service
@RequiredArgsConstructor
public class KingsDashboardService {

    private final KingsOrderMapper orderMapper;

    public Map<String, Object> getDashboardData() {
        List<KingsOrderDO> allOrders = orderMapper.selectList(new LambdaQueryWrapper<>());

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal todayRevenue = BigDecimal.ZERO;
        long totalOrderCount = allOrders.size();
        long activeTailoringCount = 0;
        long fittingsTodayCount = 0;

        LocalDate today = LocalDate.now();

        // 6-Stage Funnel counters
        Map<String, Map<String, Object>> funnelMap = new LinkedHashMap<>();
        String[] stages = {"LEAD", "APPOINTMENT", "FITTING", "PAYMENT_AGREED", "TAILORING", "DELIVERED"};
        for (String stage : stages) {
            Map<String, Object> stageData = new HashMap<>();
            stageData.put("count", 0L);
            stageData.put("totalAmount", BigDecimal.ZERO);
            funnelMap.put(stage, stageData);
        }

        // Category distribution map
        Map<String, BigDecimal> categoryMap = new HashMap<>();
        // Channel distribution map
        Map<String, Long> channelMap = new HashMap<>();

        for (KingsOrderDO order : allOrders) {
            BigDecimal orderTotal = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            BigDecimal deposit = order.getDepositAmount() != null ? order.getDepositAmount() : BigDecimal.ZERO;

            totalRevenue = totalRevenue.add(deposit);

            // Check today revenue
            if (order.getCreateTime() != null && order.getCreateTime().toLocalDate().isEqual(today)) {
                todayRevenue = todayRevenue.add(deposit);
            }

            // Funnel stats
            String st = order.getStatus() != null ? order.getStatus() : "LEAD";
            if (funnelMap.containsKey(st)) {
                Map<String, Object> sData = funnelMap.get(st);
                sData.put("count", (Long) sData.get("count") + 1);
                sData.put("totalAmount", ((BigDecimal) sData.get("totalAmount")).add(orderTotal));
            }

            // Active tailoring
            if ("TAILORING".equals(st)) {
                activeTailoringCount++;
            }

            // Appointments today
            if (order.getAppointmentDate() != null && order.getAppointmentDate().toLocalDate().isEqual(today)) {
                fittingsTodayCount++;
            }

            // Product category
            String cat = order.getProductType() != null ? order.getProductType() : "Костюм";
            categoryMap.put(cat, categoryMap.getOrDefault(cat, BigDecimal.ZERO).add(orderTotal));

            // Channels
            String ch = order.getChannel() != null ? order.getChannel() : "INSTAGRAM";
            channelMap.put(ch, channelMap.getOrDefault(ch, 0L) + 1);
        }

        BigDecimal avgCheck = totalOrderCount > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrderCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> result = new HashMap<>();
        // 1. KPI cards
        result.put("totalRevenue", totalRevenue);
        result.put("todayRevenue", todayRevenue);
        result.put("totalOrderCount", totalOrderCount);
        result.put("averageCheck", avgCheck);
        result.put("activeTailoringCount", activeTailoringCount);
        result.put("fittingsTodayCount", fittingsTodayCount);

        // 2. Funnel items
        List<Map<String, Object>> funnelList = new ArrayList<>();
        for (String stage : stages) {
            Map<String, Object> item = new HashMap<>();
            item.put("stage", stage);
            item.put("count", funnelMap.get(stage).get("count"));
            item.put("totalAmount", funnelMap.get(stage).get("totalAmount"));
            funnelList.add(item);
        }
        result.put("funnel", funnelList);

        // 3. Category chart data
        List<Map<String, Object>> categoryChart = new ArrayList<>();
        categoryMap.forEach((k, v) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("name", k);
            item.put("value", v);
            categoryChart.add(item);
        });
        result.put("categories", categoryChart);

        // 4. Channel chart data
        List<Map<String, Object>> channelChart = new ArrayList<>();
        channelMap.forEach((k, v) -> {
            Map<String, Object> item = new HashMap<>();
            item.put("name", k);
            item.put("value", v);
            channelChart.add(item);
        });
        result.put("channels", channelChart);

        return result;
    }
}
