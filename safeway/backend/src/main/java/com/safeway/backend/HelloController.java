package com.safeway.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Safeway backend is running!";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}