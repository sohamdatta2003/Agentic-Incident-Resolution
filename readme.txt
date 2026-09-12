# 🤖 AI-Powered Distributed Incident Detection & Auto-Resolution Platform

An event-driven, AI-powered incident management platform built with **Java, Spring Boot, Apache Kafka, Spring AI, and Ollama**.

The system simulates application logs, processes them through a distributed Kafka pipeline, analyzes incidents using a locally running LLM, and persists detected incidents for further investigation and automated remediation.

> 🚧 **Project Status:** Actively under development  
> Current implementation: Kafka-based distributed processing + AI-powered incident analysis  
> Planned: RAG, automated remediation, verification loops, observability, and production-style deployment.

---

## 🏗️ Architecture

                    ┌──────────────────────┐
                    │   Log Generator      │
                    │   Spring Boot        │
                    │   :8081              │
                    └──────────┬───────────┘
                               │
                               ▼
                        Kafka: logs-topic
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Log Ingestion       │
                    │  Service             │
                    │  :8082              │
                    └──────────┬───────────┘
                               │
                               ▼
                     Kafka: incident-topic
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Incident Detection   │
                    │ Service              │
                    │ :8080               │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Spring AI       │
                    │      + Ollama        │
                    │      Local LLM        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  AI Incident         │
                    │  Analysis             │
                    └──────────┬───────────┘
                               │
                               ▼
                         H2 Database
