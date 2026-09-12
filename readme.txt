# Agentic Incident Resolution System

## Problem Statement
Modern distributed systems generate massive logs. Detecting incidents,
analyzing root causes, and suggesting remediation is slow and manual.

This system detects incidents from logs, builds structured incident context,
and uses agent-based reasoning (optionally AI-powered) to suggest fixes.

## Design Principles
- AI is optional and replaceable
- System functions without cloud dependencies
- Event-driven and loosely coupled
- Optimized for local development

## MVP Scope (Phase 1)
- Log generation
- Log ingestion
- Rule-based incident detection

## Tech Stack
- Java 17
- Spring Boot
- REST APIs
- File / in-memory storage (initial)

##Final microservice flow now

POST /logs/generate
      ↓
Kafka logs-topic
      ↓
LogIngestionController
      ↓
Kafka incident-topic
      ↓
IncidentDetectionController
      ↓
AI Analysis