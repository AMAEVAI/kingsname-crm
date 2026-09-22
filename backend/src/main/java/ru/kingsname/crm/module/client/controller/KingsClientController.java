package ru.kingsname.crm.module.client.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.kingsname.crm.framework.common.pojo.CommonResult;
import ru.kingsname.crm.framework.common.pojo.PageResult;
import ru.kingsname.crm.module.client.dal.dataobject.KingsClientDO;
import ru.kingsname.crm.module.client.service.KingsClientService;

import java.util.List;

/**
 * Controller for Managing VIP Clients of KINGSNAME
 */
@RestController
@RequestMapping("/admin-api/kings/clients")
@RequiredArgsConstructor
public class KingsClientController {

    private final KingsClientService clientService;

    @GetMapping("/page")
    public CommonResult<PageResult<KingsClientDO>> getPage(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city) {
        return CommonResult.success(clientService.getClientPage(pageNo, pageSize, search, city));
    }

    @GetMapping("/list-all")
    public CommonResult<List<KingsClientDO>> listAll() {
        return CommonResult.success(clientService.getAllClients());
    }

    @GetMapping("/get")
    public CommonResult<KingsClientDO> get(@RequestParam Long id) {
        return CommonResult.success(clientService.getClient(id));
    }

    @PostMapping("/create")
    public CommonResult<KingsClientDO> create(@RequestBody KingsClientDO client, Authentication auth) {
        String creator = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        return CommonResult.success(clientService.createClient(client, creator));
    }

    @PutMapping("/update")
    public CommonResult<Boolean> update(@RequestBody KingsClientDO client, Authentication auth) {
        String updater = auth != null ? String.valueOf(auth.getPrincipal()) : "ADMIN";
        clientService.updateClient(client, updater);
        return CommonResult.success(true);
    }

    @DeleteMapping("/delete")
    public CommonResult<Boolean> delete(@RequestParam Long id) {
        clientService.deleteClient(id);
        return CommonResult.success(true);
    }
}
