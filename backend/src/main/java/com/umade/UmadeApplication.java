package com.umade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class UmadeApplication {
    public static void main(String[] args) {
        SpringApplication.run(UmadeApplication.class, args);
    }
}