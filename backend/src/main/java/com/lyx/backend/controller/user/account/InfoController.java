package com.lyx.backend.controller.user.account;

import com.lyx.backend.service.user.account.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InfoController {
    @Autowired
    private InfoService infoService;

    @PostMapping ("/api/user/account/info/")
    public Map<String,String> getinfo(){ return infoService.getinfo();}
}
