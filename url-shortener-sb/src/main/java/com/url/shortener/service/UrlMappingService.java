package com.url.shortener.service;

import com.url.shortener.dtos.ClickEventDTO;
import com.url.shortener.dtos.UrlMappingDTO;
import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UrlMappingService {

    private final UrlMappingRepository urlMappingRepository;
    private final ClickEventRepository clickEventRepository;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;
    private final AnalyticsService analyticsService;

    private static final String BASE62_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private String encodeBase62(long value) {
        StringBuilder sb = new StringBuilder();
        if (value == 0) return "0";
        while (value > 0) {
            sb.append(BASE62_CHARACTERS.charAt((int) (value % 62)));
            value /= 62;
        }
        return sb.reverse().toString();
    }

    public UrlMappingDTO createShortUrl(String originalUrl, User user) {
        // Atomic incremental counter in Redis
        Long nextId = redisTemplate.opsForValue().increment("global:url:id");
        if (nextId == null) {
            nextId = 1L;
        }
        String shortUrl = encodeBase62(nextId);

        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setOriginalUrl(originalUrl);
        urlMapping.setShortUrl(shortUrl);
        urlMapping.setUser(user);
        urlMapping.setCreatedDate(LocalDateTime.now());
        // Default expiration time: 1 year
        urlMapping.setExpiresAt(LocalDateTime.now().plusYears(1));

        UrlMapping savedUrlMapping = urlMappingRepository.save(urlMapping);
        return convertToDto(savedUrlMapping);
    }

    private UrlMappingDTO convertToDto(UrlMapping urlMapping){
        UrlMappingDTO urlMappingDTO = new UrlMappingDTO();
        urlMappingDTO.setId(urlMapping.getId());
        urlMappingDTO.setOriginalUrl(urlMapping.getOriginalUrl());
        urlMappingDTO.setShortUrl(urlMapping.getShortUrl());
        urlMappingDTO.setClickCount(urlMapping.getClickCount());
        urlMappingDTO.setCreatedDate(urlMapping.getCreatedDate());
        urlMappingDTO.setExpiresAt(urlMapping.getExpiresAt());
        urlMappingDTO.setUsername(urlMapping.getUser().getUsername());
        return urlMappingDTO;
    }

    public List<UrlMappingDTO> getUrlsByUser(User user) {
        return urlMappingRepository.findByUser(user).stream()
                .map(this::convertToDto)
                .toList();
    }

    public List<ClickEventDTO> getClickEventsByDate(String shortUrl, LocalDateTime start, LocalDateTime end) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            return clickEventRepository.findByUrlMappingAndClickDateBetween(urlMapping, start, end).stream()
                    .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()))
                    .entrySet().stream()
                    .map(entry -> {
                        ClickEventDTO clickEventDTO = new ClickEventDTO();
                        clickEventDTO.setClickDate(entry.getKey());
                        clickEventDTO.setCount(entry.getValue());
                        return clickEventDTO;
                    })
                    .collect(Collectors.toList());
        }
        return null;
    }

    public Map<LocalDate, Long> getTotalClicksByUserAndDate(User user, LocalDate start, LocalDate end) {
        List<UrlMapping> urlMappings = urlMappingRepository.findByUser(user);
        List<ClickEvent> clickEvents = clickEventRepository.findByUrlMappingInAndClickDateBetween(urlMappings, start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        return clickEvents.stream()
                .collect(Collectors.groupingBy(click -> click.getClickDate().toLocalDate(), Collectors.counting()));
    }

    public UrlMapping getOriginalUrl(String shortUrl, String ipAddress, String userAgent) {
        String cacheKey = "url:" + shortUrl;
        String cachedValue = redisTemplate.opsForValue().get(cacheKey);

        if (cachedValue != null) {
            int colonIndex = cachedValue.indexOf(':');
            if (colonIndex > 0) {
                Long id = Long.parseLong(cachedValue.substring(0, colonIndex));
                String originalUrl = cachedValue.substring(colonIndex + 1);

                UrlMapping urlMapping = new UrlMapping();
                urlMapping.setId(id);
                urlMapping.setOriginalUrl(originalUrl);

                // Asynchronously log click
                analyticsService.logClickAsync(id, ipAddress, userAgent);

                return urlMapping;
            }
        }

        // Cache miss
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping != null) {
            // Check expiration
            if (urlMapping.getExpiresAt() != null && urlMapping.getExpiresAt().isBefore(LocalDateTime.now())) {
                return null;
            }

            // Calculate TTL matching the link's expiration (up to 1 day max)
            long ttlSeconds = 86400;
            if (urlMapping.getExpiresAt() != null) {
                long secondsToExpiry = java.time.Duration.between(LocalDateTime.now(), urlMapping.getExpiresAt()).getSeconds();
                if (secondsToExpiry <= 0) {
                    return null;
                }
                ttlSeconds = Math.min(ttlSeconds, secondsToExpiry);
            }

            // Cache the ID and original URL in Redis
            String valueToCache = urlMapping.getId() + ":" + urlMapping.getOriginalUrl();
            redisTemplate.opsForValue().set(cacheKey, valueToCache, ttlSeconds, java.util.concurrent.TimeUnit.SECONDS);

            // Asynchronously log click
            analyticsService.logClickAsync(urlMapping.getId(), ipAddress, userAgent);

            return urlMapping;
        }
        return null;
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteShortUrl(String shortUrl, User user) {
        UrlMapping urlMapping = urlMappingRepository.findByShortUrl(shortUrl);
        if (urlMapping == null) {
            throw new RuntimeException("URL mapping not found");
        }
        if (!urlMapping.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this URL");
        }
        urlMappingRepository.delete(urlMapping);
        // Invalidate Redis cache
        redisTemplate.delete("url:" + shortUrl);
    }

    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 3 * * ?") // 3 AM daily
    @org.springframework.transaction.annotation.Transactional
    public void purgeExpiredUrls() {
        urlMappingRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
