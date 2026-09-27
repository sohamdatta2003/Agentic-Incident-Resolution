package com.agentic.incident_detection_service.service;

import com.agentic.incident_detection_service.model.IncidentAnalysis;
import com.agentic.incident_detection_service.model.LogEntry;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIAnalysisService {

    private final ChatClient chatClient;
    private final KnowledgeBaseService knowledgeBaseService;

    public AIAnalysisService(
            ChatClient.Builder builder,
            KnowledgeBaseService knowledgeBaseService) {

        this.chatClient = builder.build();
        this.knowledgeBaseService = knowledgeBaseService;
    }

    public IncidentAnalysis analyze(LogEntry log) {

        // 🔎 Retrieve relevant knowledge
        List<Document> documents =
                knowledgeBaseService.search(log.getMessage());

        String knowledgeContext = documents.stream()
                .map(Document::getText)
                .reduce("", (a, b) -> a + "\n\n" + b);

        System.out.println("📚 RAG CONTEXT:");
        System.out.println(knowledgeContext);

        return chatClient.prompt()

                .system("""
                        You are an expert Site Reliability Engineer.

                        Analyze application incidents using the provided
                        incident information and retrieved knowledge.

                        Determine:

                        1. Whether this represents a real incident
                        2. Severity: LOW, MEDIUM, HIGH, or CRITICAL
                        3. Incident category
                        4. Likely root cause
                        5. Confidence from 0.0 to 1.0
                        6. Recommended remediation
                        7. Whether the remediation can safely be automated

                        Be conservative when deciding autoResolvable.

                        Only mark an incident as auto-resolvable when
                        the remediation is deterministic and safe.

                        Retrieved knowledge may contain useful runbooks,
                        but do not blindly trust it if it conflicts
                        with the actual incident.
                        """)

                .user("""
                        Analyze this application incident.

                        INCIDENT:
                        Service: %s
                        Level: %s
                        Message: %s
                        Timestamp: %d

                        RETRIEVED KNOWLEDGE:
                        %s
                        """.formatted(
                        log.getService(),
                        log.getLevel(),
                        log.getMessage(),
                        log.getTimestamp(),
                        knowledgeContext
                ))

                .call()
                .entity(IncidentAnalysis.class);
    }
}