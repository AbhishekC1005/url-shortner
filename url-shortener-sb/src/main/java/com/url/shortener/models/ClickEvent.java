package com.url.shortener.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "click_event", indexes = {
    @Index(name = "idx_click_event_mapping_date", columnList = "url_mapping_id, clickDate")
})
public class ClickEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime clickDate;
    private String ipAddress;
    private String country;
    private String browser;
    private String os;
    private String deviceType;

    @ManyToOne
    @JoinColumn(name = "url_mapping_id")
    private UrlMapping urlMapping;
}
