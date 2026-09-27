package com.agentic.incident_detection_service.controller;

import com.agentic.incident_detection_service.model.IncidentAnalysis;
import com.agentic.incident_detection_service.model.LogEntry;
import com.agentic.incident_detection_service.service.AIAnalysisService;
import com.agentic.incident_detection_service.service.IncidentDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentDetectionController {

    private final AIAnalysisService aiAnalysisService;
    private final IncidentDetectionService detectionService;

    public IncidentDetectionController(
            AIAnalysisService aiAnalysisService,
            IncidentDetectionService detectionService) {
        this.aiAnalysisService = aiAnalysisService;
        this.detectionService = detectionService;
    }

    @KafkaListener(topics = "incident-topic", groupId = "detection-group")
    public void detect(LogEntry log) {

        System.out.println("🔥 DETECTION HIT!");
        System.out.println(log);

        IncidentAnalysis analysis = aiAnalysisService.analyze(log);

        System.out.println("🤖 AI ANALYSIS");
        System.out.println(analysis);
    }

    @GetMapping("/errors")
    public Object getErrorLogs() {
        return detectionService.getErrorLogs();
    }
}
