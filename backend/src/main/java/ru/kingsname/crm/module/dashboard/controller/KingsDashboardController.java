package ru.kingsname.crm.module.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.module.dashboard.service.KingsDashboardService;

import java.util.Map;

/**
 * Controller providing Realtime KPI, Funnel and Chart Analytics
 */
@RestController
@RequestMapping("/admin-api/kings/dashboard")
@RequiredArgsConstructor
public class KingsDashboardController {

    private final KingsDashboardService dashboardService;

    @GetMapping("/analytics")
    public CommonResult<Map<String, Object>> getAnalytics() {
        return CommonResult.success(dashboardService.getDashboardData());
    }
}
