package com.agentic.log_generator_service.controller;

import com.agentic.log_generator_service.model.LogEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/logs")
public class LogGeneratorController {

    private final KafkaTemplate<String, LogEntry> kafkaTemplate;

    public LogGeneratorController(KafkaTemplate<String, LogEntry> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateLogs() {

        LogEntry log = new LogEntry(
                "order-service",
                "ERROR",
                "Database connection timeout",
                Instant.now().toEpochMilli()
        );

        kafkaTemplate.send("logs-topic", log).whenComplete((result, ex) -> {
            if (ex != null) {
                System.out.println("❌ Kafka publish failed:");
                ex.printStackTrace();
            } else {
                System.out.println("✅ Kafka publish successful: "
                        + result.getRecordMetadata());
            }
        });

        return ResponseEntity.ok("✅ Log published to Kafka");
    }
}
