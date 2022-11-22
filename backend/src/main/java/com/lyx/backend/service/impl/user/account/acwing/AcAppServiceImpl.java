package com.lyx.backend.service.impl.user.account.acwing;

import com.alibaba.fastjson2.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lyx.backend.mapper.UserMapper;
import com.lyx.backend.pojo.User;
import com.lyx.backend.service.impl.user.account.acwing.utils.HttpClientUtil;
import com.lyx.backend.service.user.account.acwing.AcAppService;
import com.lyx.backend.utils.JwtUtil;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.Duration;
import java.util.*;

@Service
public class AcAppServiceImpl  implements AcAppService {
    private final static String appId="3565";
    private final static String appSecret="655793798815458c9e3c700829c65da8";
    private final static String redirectUri="https://app3565.acapp.acwing.com.cn/api/user/account/acwing/acapp/receive_code/";
    private final static String applyAccessTokenUrl = "https://www.acwing.com/third_party/api/oauth2/access_token/";
    private final static String getUserInfoUrl="https://www.acwing.com/third_party/api/meta/identity/getinfo/";
    private static final Random random = new Random();

    @Autowired
    private RedisTemplate<String,String> redisTemplate;
    @Autowired
    private UserMapper userMapper;

    @Override
    public JSONObject applyCode() {
        JSONObject resp = new JSONObject();
        resp.put("appid",appId);
        try {
            resp.put("redirect_uri", URLEncoder.encode(redirectUri,"UTF-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            resp.put("result","failed");
            return resp;
        }
        resp.put("scope","userinfo");
        StringBuilder state = new StringBuilder();
        for(int i = 0; i < 10; i ++)
        {
            state.append((char) (random.nextInt(10) + '0'));
        }
        resp.put("state", state.toString());
        resp.put("result","success");
        redisTemplate.opsForValue().set(state.toString(),"true");
        redisTemplate.expire(state.toString(), Duration.ofMinutes(10)); //10分钟

        return resp;
    }

    @Override
    public JSONObject receiveCode(String code, String state) {
        JSONObject resp = new JSONObject();
        resp.put("result","failed");
        if(code == null || state == null) return  resp;
        if(Boolean.FALSE.equals(redisTemplate.hasKey(state))) return resp;
        redisTemplate.delete(state);
        List<NameValuePair> nameValuePairs = new LinkedList<>();
        nameValuePairs.add(new BasicNameValuePair("appid",appId));
        nameValuePairs.add(new BasicNameValuePair("secret",appSecret));
        nameValuePairs.add(new BasicNameValuePair("code",code));

        String getString  = HttpClientUtil.get(applyAccessTokenUrl,nameValuePairs);
        if(getString == null) return resp;
        JSONObject getResp  = JSONObject.parseObject(getString);
        String accessToken = getResp.getString("access_token");
        String openid = getResp.getString("openid");
        if(accessToken == null || openid == null) return resp;

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("openid",openid);
        List<User> users = userMapper.selectList(queryWrapper);
        if(!users.isEmpty()){
            User user = users.get(0);
            String jwt = JwtUtil.createJWT(user.getId().toString());

            Map<String,String> map = new HashMap<>();
            map.put("result","success");
            map.put("jwt_token",jwt);
        }
        nameValuePairs = new LinkedList<>();
        nameValuePairs.add(new BasicNameValuePair("access_token",accessToken));
        nameValuePairs.add(new BasicNameValuePair("openid",openid));
        getString  = HttpClientUtil.get(getUserInfoUrl,nameValuePairs);
        if(getString == null) return resp;
        getResp = JSONObject.parseObject(getString);
        String username = getResp.getString("username");
        String photo = getResp.getString("photo");

        User user = new User(null,username,null,photo,openid);
        userMapper.insert(user);
        String jwt = JwtUtil.createJWT(user.getId().toString());
        resp.put("result","success");
        resp.put("jwt_token",jwt);
        return resp;
    }
}
