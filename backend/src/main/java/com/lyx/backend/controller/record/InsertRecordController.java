package com.lyx.backend.controller.record;

import com.alibaba.fastjson2.JSONObject;
import com.lyx.backend.service.record.UpdateRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class InsertRecordController {
    @Autowired
    private UpdateRecordService updateRecordService;

    @PostMapping("/api/record/insert/")
    public String update(@RequestParam Map<String,String>map){
        String t_uuid = map.get("uuid");
        System.out.println(t_uuid);
        JSONObject resp = new JSONObject();
        if(t_uuid == null || "".equals(t_uuid)){
            resp.put("error_message","没有用的");
            return resp.toJSONString();
        }
        int uuid = Integer.parseInt(t_uuid);
        uuid /= 10;
        if(uuid % 22 != 0)
        {
            resp.put("error_message","没有用的");
            return resp.toJSONString();
        }
        return updateRecordService.insert();
    }
}
