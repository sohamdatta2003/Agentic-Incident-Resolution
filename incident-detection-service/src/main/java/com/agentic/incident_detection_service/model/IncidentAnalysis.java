package com.agentic.incident_detection_service.model;

public record IncidentAnalysis(  boolean isIncident,
                                String severity,
                                String category,
                                String rootCause,
                                double confidence,
                                String recommendedAction,
                                boolean autoResolvable){
}
