package com.agentic.incident_detection_service.controller;

import com.agentic.incident_detection_service.model.LogEntry;
import com.agentic.incident_detection_service.service.IncidentDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentDetectionController {

    private final IncidentDetectionService detectionService;

    public IncidentDetectionController(IncidentDetectionService detectionService) {
        this.detectionService = detectionService;
    }

    @KafkaListener(topics = "incident-topic", groupId = "detection-group")
    public void detect(LogEntry log) {
        System.out.println("🔥 DETECTION HIT!");
        System.out.println(log);
        String result = detectionService.detectIncident(log);

        System.out.println("🚨 " + result);
    }

    @GetMapping("/errors")
    public Object getErrorLogs() {
        return detectionService.getErrorLogs();
    }
}
