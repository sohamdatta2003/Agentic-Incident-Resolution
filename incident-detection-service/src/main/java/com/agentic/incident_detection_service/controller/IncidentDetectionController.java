package com.agentic.incident_detection_service.controller;

import com.agentic.incident_detection_service.model.LogEntry;
import com.agentic.incident_detection_service.service.IncidentDetectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incidents")
public class IncidentDetectionController {

    private final IncidentDetectionService incidentService;

    public IncidentDetectionController(IncidentDetectionService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping("/detect")
    public String detect(@RequestBody LogEntry log) {

        System.out.println("🔥 DETECTION HIT!");
        System.out.println(log);

        String result = incidentService.detectIncident(log);

        System.out.println(result);

        return result;
    }
    @GetMapping("/errors")
    public List<LogEntry> getErrorLogs() {
        return incidentService.getErrorLogs();
    }
}
