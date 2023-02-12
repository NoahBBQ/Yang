package com.lyx.backend.service.impl.record;

import com.alibaba.fastjson2.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lyx.backend.mapper.RecordMapper;
import com.lyx.backend.mapper.UserMapper;
import com.lyx.backend.pojo.Record;
import com.lyx.backend.pojo.User;
import com.lyx.backend.service.record.InfoRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Service
public class InfoRecordServiceImpl implements InfoRecordService {
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private UserMapper userMapper;

    @Override
    public String getAll() {
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String nowStr = sdf.format(now) +" 00:00:00";

        QueryWrapper<Record> queryWrapper = new QueryWrapper<>();
        IPage<Record> recordIPage = new Page<>(1,50);
        queryWrapper.ge("time",nowStr).orderByAsc("time");

        List<Record> records = recordMapper.selectPage(recordIPage, queryWrapper).getRecords();
        JSONObject resp = new JSONObject();
        List<User> users = new LinkedList<>();
        for (Record record : records) {
            User user = userMapper.selectById(record.getUid());
            user.setPassword("");
            users.add(user);
        }
        resp.put("records",records);
        resp.put("users",users);
        return resp.toJSONString();
    }
}
