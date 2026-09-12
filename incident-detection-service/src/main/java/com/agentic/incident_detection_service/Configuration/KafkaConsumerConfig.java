package com.agentic.incident_detection_service.Configuration;

import com.agentic.incident_detection_service.model.LogEntry;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.context.annotation.*;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JacksonJsonDeserializer;

import java.util.*;

@Configuration
public class KafkaConsumerConfig {

    @Bean
    public ConsumerFactory<String, LogEntry> consumerFactory() {

        JacksonJsonDeserializer<LogEntry> deserializer =
                new JacksonJsonDeserializer<>(LogEntry.class);

        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);

        Map<String, Object> config = new HashMap<>();

        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "detection-group");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        return new DefaultKafkaConsumerFactory<>(
                config,
                new StringDeserializer(),
                deserializer
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, LogEntry>
    kafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, LogEntry> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
