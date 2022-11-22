package com.lyx.backend.controller;

import com.alibaba.fastjson2.JSONObject;
import com.lyx.backend.pojo.Cell;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
public class test {

    @RequestMapping("/api/test/index/")
    String index(@RequestParam Map<String,String> data){
        Map<String,String>map = new HashMap<>();
        JSONObject resp = new JSONObject();
        ArrayList<Cell> list = new ArrayList<>();
        ArrayList<Integer>cnt = new ArrayList<>();
        int uuid = 19800;
        //现在是做测试 所以怎么写都没有问题以后就不一样了

        String level = data.get("level");
        String src = "/home/ylgy_acs/y/backend/level/"+level+"/";

        File srcFile = new File(src);
        File[] files = srcFile.listFiles();
        Random random = new Random();
        //注意files 不能为空
        int p =  random.nextInt(files.length) + 1;
        String fileName = src + level +"-v-" + p +".txt";
        try {
            File file = new File(fileName);
            if(file.exists()) {
                FileReader reader = new FileReader(file);
                BufferedReader br = new BufferedReader(reader);
                String [] s = br.readLine().split(" ");
                int n = Integer.parseInt(s[0]),m = Integer.parseInt(s[1]);
                System.out.println(n + " " + m);
                s = br.readLine().split(" ");
                for (String value : s) {
                    int x = Integer.parseInt(value);
                    cnt.add(x);
                }
                for(int i = 1; i <= n; i ++)
                {
                    s = br.readLine().split(" ");
                    //System.out.println(s[0] + " "+ s[1]);
                    double x = Double.parseDouble(s[0]),y = Double.parseDouble(s[1]),z = i;
                    list.add(new Cell(x,y,z));
                }
                if("3".equals(level))
                {
                    resp.put("uuid",uuid);
                }
                resp.put("tot",n);
                resp.put("kinds",m);
                resp.put("cards",list);
                resp.put("cnt",cnt);
                resp.put("error_message","success");
            }
            else{
                System.out.println("文件不存在访问失败!!!");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return resp.toJSONString();
    }
}
