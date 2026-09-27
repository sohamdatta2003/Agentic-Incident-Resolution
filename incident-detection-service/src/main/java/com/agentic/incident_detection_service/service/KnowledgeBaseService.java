package com.agentic.incident_detection_service.service;


import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class KnowledgeBaseService implements CommandLineRunner {

    private final SimpleVectorStore vectorStore;

    public KnowledgeBaseService(SimpleVectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    @Override
    public void run(String... args) throws IOException {

        PathMatchingResourcePatternResolver resolver =
                new PathMatchingResourcePatternResolver();

        Resource[] resources =
                resolver.getResources("classpath:/knowledge/*.txt");

        List<Document> documents = new ArrayList<>();

        for (Resource resource : resources) {

            String content = resource.getContentAsString(
                    StandardCharsets.UTF_8
            );

            Document document = new Document(content);

            document.getMetadata().put(
                    "source",
                    resource.getFilename()
            );

            documents.add(document);

            System.out.println(
                    "📄 Loaded knowledge: " + resource.getFilename()
            );
        }

        vectorStore.add(documents);

        System.out.println(
                "📚 RAG knowledge base loaded: "
                        + documents.size()
                        + " documents"
        );
    }

    public List<Document> search(String query) {

        SearchRequest request = SearchRequest.builder()
                .query(query)
                .topK(3)
                .similarityThreshold(0.5)
                .build();

        return vectorStore.similaritySearch(request);
    }
}
