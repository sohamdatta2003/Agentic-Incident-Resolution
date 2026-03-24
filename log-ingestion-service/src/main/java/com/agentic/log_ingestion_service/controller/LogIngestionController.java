package com.agentic.log_ingestion_service.controller;

import com.agentic.log_ingestion_service.model.LogEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/logs")
public class LogIngestionController {

    private RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public ResponseEntity<String> ingestLog(@RequestBody LogEntry logEntry) {

        System.out.println("Log received:");
        System.out.println(logEntry.getService());
        System.out.println(logEntry.getLevel());
        System.out.println(logEntry.getMessage());
        System.out.println(logEntry.getTimestamp());

        String detectionServiceUrl = "http://localhost:8080/incidents/detect";

        try {
            String response = restTemplate.postForObject(
                    detectionServiceUrl,
                    logEntry,
                    String.class
            );

            System.out.println("Response from detection: " + response);

            return ResponseEntity.ok("Forwarded to Detection Service: " + response);

        } catch (Exception e) {
            System.out.println("❌ Error while calling detection service:");
            e.printStackTrace();

            return ResponseEntity.status(500).body("Error calling detection service");
        }
    }
}