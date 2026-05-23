package com.nhom8.crm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Cho phép tất cả các đường dẫn API
                        .allowedOrigins(
                                "http://localhost:3000", // Cổng mặc định của React / NextJS
                                "http://localhost:5173", // Cổng mặc định của Vite (React, Vue, Svelte)
                                "http://localhost:8080",
                                "http://127.0.0.1:3000",
                                "http://127.0.0.1:5173"
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Cho phép các phương thức HTTP này
                        .allowedHeaders("*") // Cho phép tất cả các Headers nhận từ FE
                        .allowCredentials(true) // Cho phép FE gửi Cookie hoặc Auth Header cùng Request
                        .maxAge(3600); // Cache cấu hình CORS này trong 1 giờ để giảm các Pre-flight requests dư thừa
            }
        };
    }
}
