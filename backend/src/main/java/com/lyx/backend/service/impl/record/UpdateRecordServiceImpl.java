package com.lyx.backend.service.impl.record;

import com.alibaba.fastjson2.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lyx.backend.mapper.RecordMapper;
import com.lyx.backend.pojo.Record;
import com.lyx.backend.pojo.User;
import com.lyx.backend.service.impl.utils.UserDetailsImpl;
import com.lyx.backend.service.record.UpdateRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class UpdateRecordServiceImpl implements UpdateRecordService {
    @Autowired
    private RecordMapper recordMapper;

    @Override
    public String insert() {
        UsernamePasswordAuthenticationToken authentication =
            (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();
        QueryWrapper<Record> queryWrapper = new QueryWrapper<>();
        //查询记录条数
        QueryWrapper<Record> countWrapper = new QueryWrapper<>();

        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String nowStr = sdf.format(now) +" 00:00:00";

        queryWrapper.eq("uid",user.getId().toString()).ge("time",nowStr);
        countWrapper.ge("time",nowStr);
        List<Record> records = recordMapper.selectList(countWrapper);

        int rank = 0;
        if(records != null) rank += records.size();

        JSONObject resp = new JSONObject();
        List<Record> recordList = recordMapper.selectList(queryWrapper);
        if(recordList.isEmpty()) {
            recordMapper.insert(new Record(null, user.getId(), new Date()));
            resp.put("error_message", "success");
            rank += 1;
            resp.put("rank","首次通关 第:"+rank+"名");
        }else{

            for(int i = 0; i < records.size(); i ++)
                if(records.get(i).getUid().equals(user.getId()))
                {
                    rank = i + 1;
                    break;
                }
            resp.put("error_message","success");
            resp.put("rank","今日已上榜:" + rank +"名");
        }
        return resp.toJSONString();
    }
}
