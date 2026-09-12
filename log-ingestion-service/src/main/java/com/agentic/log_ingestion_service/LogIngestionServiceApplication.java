package com.agentic.log_ingestion_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.annotation.KafkaListener;

@SpringBootApplication
public class LogIngestionServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogIngestionServiceApplication.class, args);
	}

}
