package com.agentic.incident_detection_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;


@SpringBootApplication
@EnableKafka
public class IncidentDetectionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(IncidentDetectionServiceApplication.class, args);
	}

}
