package com.agentic.incident_detection_service.service;

import org.springframework.stereotype.Service;

@Service
public class AIAnalysisService {

    public String analyze(String message) {

        // 🔥 FAKE AI (RAG-style rules for now)
        if (message.toLowerCase().contains("timeout")) {
            return "Cause: Database overload or slow query. Suggestion: Optimize queries or increase timeout.";
        }

        if (message.toLowerCase().contains("connection")) {
            return "Cause: Network issue or DB connection pool exhausted. Suggestion: Check DB connections.";
        }

        return "Cause: Unknown. Suggestion: Investigate logs.";
    }
}
