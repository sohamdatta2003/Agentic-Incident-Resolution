package com.agentic.log_generator_service.model;

import java.time.Instant;

public class LogEntry {

    private String service;
    private String level;
    private String message;
    private long timestamp;

    // Default constructor (VERY IMPORTANT for JSON mapping)
    public LogEntry() {
    }

    // Parameterized constructor
    public LogEntry(String service, String level, String message, long timestamp) {
        this.service = service;
        this.level = level;
        this.message = message;
        this.timestamp = timestamp;
    }

    // Getter and Setter for service
    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    // Getter and Setter for level
    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    // Getter and Setter for message
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Getter and Setter for timestamp
    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}