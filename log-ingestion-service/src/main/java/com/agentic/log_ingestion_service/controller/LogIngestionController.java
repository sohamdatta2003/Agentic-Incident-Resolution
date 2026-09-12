package com.agentic.log_ingestion_service.controller;

import com.agentic.log_ingestion_service.model.LogEntry;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogIngestionController {

    private final KafkaTemplate<String, LogEntry> kafkaTemplate;

    public LogIngestionController(KafkaTemplate<String, LogEntry> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "logs-topic", groupId = "ingestion-group")
    public void ingestLog(@Payload LogEntry logEntry) {

        System.out.println("📥 Log received in ingestion service");
        System.out.println(logEntry);

        // forward to next topic
        kafkaTemplate.send("incident-topic", logEntry)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        System.out.println("❌ INGESTION → INCIDENT KAFKA FAILED");
                        ex.printStackTrace();
                    } else {
                        System.out.println("✅ INGESTION → INCIDENT KAFKA SUCCESS: "
                                + result.getRecordMetadata());
                    }
                });
    }
}