package com.lyx.backend.controller.record;

import com.lyx.backend.service.record.InfoRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GetRecordController {
    @Autowired
    private InfoRecordService infoRecordService;

    @GetMapping("/api/record/get/")
    public String getRecords(){
        //是前50位
        return infoRecordService.getAll();
    }
}
