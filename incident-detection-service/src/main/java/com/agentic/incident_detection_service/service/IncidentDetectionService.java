package com.agentic.incident_detection_service.service;

import com.agentic.incident_detection_service.model.LogEntry;
import com.agentic.incident_detection_service.repository.LogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentDetectionService {

    private final LogRepository logRepository;

    public IncidentDetectionService(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    public String detectIncident(LogEntry log) {

        logRepository.save(log);

        if (log.getLevel().equalsIgnoreCase("ERROR")) {
            return "🚨 INCIDENT DETECTED: " + log.getMessage();
        }

        return "Log processed successfully";
    }

    public List<LogEntry> getErrorLogs() {
        return logRepository.findByLevel("ERROR");
    }
}