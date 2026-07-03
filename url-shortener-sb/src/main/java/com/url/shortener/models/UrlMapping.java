package com.url.shortener.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "url_mapping", indexes = {
    @Index(name = "idx_url_mapping_short_url", columnList = "shortUrl", unique = true),
    @Index(name = "idx_url_mapping_user_id", columnList = "user_id")
})
public class UrlMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String originalUrl;
    private String shortUrl;
    private int clickCount = 0;
    private LocalDateTime createdDate;
    private LocalDateTime expiresAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "urlMapping", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<ClickEvent> clickEvents;
}
