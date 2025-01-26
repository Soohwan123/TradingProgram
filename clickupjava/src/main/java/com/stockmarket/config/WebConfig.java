package com.stockmarket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 허용할 origin 설정
        config.addAllowedOrigin("http://localhost:5173");  // Vite의 기본 포트
        config.addAllowedOrigin("http://localhost:5174");  // Vite의 기본 포트
        config.addAllowedOrigin("http://localhost:3000");  // React의 기본 포트
        config.addAllowedOrigin("http://localhost:5000");  // React의 기본 포트
        
        // 기타 CORS 설정
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/graphql/**", config);
        return new CorsFilter(source);
    }
} 