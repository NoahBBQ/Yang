package com.lyx.backend.service.impl.user.account;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lyx.backend.mapper.UserMapper;
import com.lyx.backend.pojo.User;
import com.lyx.backend.service.impl.utils.UserDetailsImpl;
import com.lyx.backend.service.user.account.UpdatePhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UpdatePhotoServiceImpl implements UpdatePhotoService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public Map<String, String> update(String photo) {
        UsernamePasswordAuthenticationToken authentication =
            (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl loginUser = (UserDetailsImpl) authentication.getPrincipal();
        User user = loginUser.getUser();
        user.setPhoto(photo);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id",user.getId().toString());
        userMapper.update(user,queryWrapper);
        Map<String,String>map = new HashMap<>();
        map.put("error_message","success");
        return map;
    }
}
