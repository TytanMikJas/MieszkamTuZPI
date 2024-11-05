package com.mitu;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.text.SimpleDateFormat;
import java.util.Date;

@SpringBootApplication
@Log4j2
@EnableScheduling
@EnableJpaRepositories("com.mitu.database.repository")
@EntityScan("com.mitu.database.model")
@RequiredArgsConstructor
public class MainRunner {
    private SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    public static void main(String[] args) {
        SpringApplication.run(MainRunner.class, args);
    }

    @Scheduled(fixedRate = 5000)
    public void reportCurrentTime() {
        log.info("The time is now {}", dateFormat.format(new Date()));
    }
}
