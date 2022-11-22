package com.lyx.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.logging.SimpleFormatter;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
        String src = "src/main/resources/static/level/1/";
        File srcFile = new File(src);
        File[] files = srcFile.listFiles();
        Random random = new Random();
        System.out.println(random.nextInt(files.length) + 1);

    }

}
