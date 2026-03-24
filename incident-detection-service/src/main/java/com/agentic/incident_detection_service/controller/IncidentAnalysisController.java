package com.agentic.incident_detection_service.controller;

import com.agentic.incident_detection_service.model.LogEntry;
import com.agentic.incident_detection_service.service.AIAnalysisService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/incidents")
public class IncidentAnalysisController {

    private final AIAnalysisService aiService;

    public IncidentAnalysisController(AIAnalysisService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze")
    public String analyze(@RequestBody LogEntry log) {
        return aiService.analyze(log.getMessage());
    }
}