package com.agentic.log_generator_service.controller;

import com.agentic.log_generator_service.model.LogEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;

@RestController
@RequestMapping("/logs")
public class LogGeneratorController {

    private final RestTemplate restTemplate;

    public LogGeneratorController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateLogs() {

        LogEntry log = new LogEntry(
                "order-service",
                "ERROR",
                "Database connection timeout",
                Instant.now().toEpochMilli()
        );

        // send this log to ingestion service

        String ingestionUrl = "http://localhost:8082/logs";

        restTemplate.postForObject(ingestionUrl, log, String.class);

        return ResponseEntity.ok("Log generated and sent to ingestion service");
    }
}
