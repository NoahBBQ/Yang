package com.lyx.backend.service.impl.user.account.acwing;

import com.alibaba.fastjson2.JSONObject;
import com.lyx.backend.service.user.account.acwing.WebService;
import org.springframework.stereotype.Service;

@Service
public class WebServiceImpl implements WebService {
    @Override
    public JSONObject applyCode() {
        return null;
    }

    @Override
    public JSONObject receiveCode(String code, String state) {
        return null;
    }
}
