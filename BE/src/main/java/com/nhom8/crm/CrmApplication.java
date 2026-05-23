package com.nhom8.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  CRM BACKEND SYSTEM RUNNING SUCCESSFULLY ON PORT 8080");
        System.out.println("==================================================");
    }
}
