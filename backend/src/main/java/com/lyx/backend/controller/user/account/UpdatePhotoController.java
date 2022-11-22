package com.lyx.backend.controller.user.account;

import com.lyx.backend.mapper.UserMapper;
import com.lyx.backend.pojo.User;
import com.lyx.backend.service.impl.utils.UserDetailsImpl;
import com.lyx.backend.service.user.account.UpdatePhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UpdatePhotoController {
    @Autowired
    UpdatePhotoService updatePhotoService;

    @PostMapping("/api/user/account/update/photo/")
    public Map<String,String> update(@RequestParam Map<String,String>map){
        String photo = map.get("photo");
        return updatePhotoService.update(photo);
    }
}
