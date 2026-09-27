# 🤖 AI-Powered Distributed Incident Detection & Auto-Resolution Platform

An event-driven, AI-powered incident management platform built with **Java, Spring Boot, Apache Kafka, Spring AI, Ollama, and React**.

The platform simulates application logs, processes them through a distributed Kafka pipeline, detects incidents, enriches them with **RAG-based operational knowledge**, and uses a locally running LLM to analyze incidents and recommend remediation actions.

> 🚧 **Project Status:** Actively under development  
> ✅ Current implementation: Distributed Kafka pipeline + AI incident analysis + RAG knowledge retrieval + H2 persistence  
> 🔨 In progress: React dashboard and incident management UI  
> 📋 Planned: Automated remediation, verification loops, ServiceNow integration, observability, and production-style deployment

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │    Log Generator     │
                         │     Spring Boot      │
                         │        :8081         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                           Kafka: logs-topic
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Log Ingestion      │
                         │       Service        │
                         │     Spring Boot      │
                         │        :8082         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                        Kafka: incident-topic
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Incident Detection   │
                         │       Service       │
                         │     Spring Boot      │
                         │        :8080         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   RAG Knowledge      │
                         │       Base           │
                         │ SimpleVectorStore    │
                         └──────────┬───────────┘
                                    │
                         Semantic Similarity Search
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Spring AI       │
                         │        + Ollama      │
                         │      Qwen3 1.7B      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   AI Incident        │
                         │      Analysis        │
                         │                      │
                         │ • Incident Detection │
                         │ • Severity            │
                         │ • Category            │
                         │ • Root Cause          │
                         │ • Confidence          │
                         │ • Remediation         │
                         │ • Auto-Resolution     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      H2 Database     │
                         │   Incident Storage   │
                         └──────────────────────┘
🔄 End-to-End Flow

Application Log
      │
      ▼
Log Generator
      │
      ▼
Kafka (logs-topic)
      │
      ▼
Log Ingestion Service
      │
      ▼
Kafka (incident-topic)
      │
      ▼
Incident Detection Service
      │
      ▼
RAG Knowledge Retrieval
      │
      ▼
Spring AI + Ollama
      │
      ▼
AI Incident Analysis
      │
      ├── Severity
      ├── Category
      ├── Root Cause
      ├── Confidence
      ├── Recommended Action
      └── Auto-Resolution Decision
      │
      ▼
H2 Persistence


🧠 AI & RAG Pipeline

The incident detection service combines LLM reasoning with retrieved operational knowledge.

Local LLM

The platform uses:

Ollama
Qwen3 1.7B

The LLM analyzes structured incident information and produces:

IncidentAnalysis
├── isIncident
├── severity
├── category
├── rootCause
├── confidence
├── recommendedAction
└── autoResolvable
Retrieval-Augmented Generation

The project currently uses:

Spring AI
SimpleVectorStore
nomic-embed-text
Text-based operational runbooks

Knowledge is loaded from:

src/main/resources/knowledge/

Current runbooks include:

knowledge/
├── database-timeout.txt
└── kafka-consumer-lag.txt

The system performs semantic similarity search against these runbooks before sending the incident to the LLM.

Example:

Incident:
Database connection timeout
        │
        ▼
Vector similarity search
        │
        ▼
Database Timeout Runbook
        │
        ▼
Relevant operational context
        │
        ▼
Qwen3 1.7B
        │
        ▼
Structured IncidentAnalysis
