package com.agentic.incident_detection_service.repository;

import com.agentic.incident_detection_service.model.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<LogEntry, Long> {

    List<LogEntry> findByLevel(String level);
}