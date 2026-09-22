package ru.kingsname.crm;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * KINGSNAME CRM Server Application
 * Built upon ruoyi-vue-pro architectural patterns
 *
 * @author Antigravity (Pair Programming with BlackBorz)
 */
@SpringBootApplication
@MapperScan("ru.kingsname.crm.module.**.dal.mysql")
public class KingsnameCrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(KingsnameCrmApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  👑 KINGSNAME CRM (Haute Sartorial & Bespoke Tailoring, Grozny)");
        System.out.println("  🌐 Backend is listening on: http://localhost:48080/admin-api");
        System.out.println("  🔑 Master 8-Digit Security Access Code: 88888888");
        System.out.println("==================================================================");
    }
}
