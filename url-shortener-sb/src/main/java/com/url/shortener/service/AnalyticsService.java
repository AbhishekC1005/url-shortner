package com.url.shortener.service;

import com.url.shortener.models.ClickEvent;
import com.url.shortener.models.UrlMapping;
import com.url.shortener.repository.ClickEventRepository;
import com.url.shortener.repository.UrlMappingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final ClickEventRepository clickEventRepository;
    private final UrlMappingRepository urlMappingRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    private final UserAgentAnalyzer uaa = UserAgentAnalyzer.newBuilder()
            .withCache(10000)
            .withField(UserAgent.DEVICE_CLASS)
            .withField(UserAgent.AGENT_NAME)
            .withField(UserAgent.OPERATING_SYSTEM_NAME)
            .build();

    @Async
    @Transactional
    public void logClickAsync(Long urlMappingId, String ipAddress, String userAgentHeader) {
        log.info("Asynchronously logging click for urlMappingId: {} from IP: {}", urlMappingId, ipAddress);

        try {
            // 1. Increment click count in DB atomically
            urlMappingRepository.incrementClickCount(urlMappingId);

            // 2. Parse User Agent
            String browser = "Unknown";
            String os = "Unknown";
            String deviceType = "Unknown";

            if (userAgentHeader != null && !userAgentHeader.isEmpty()) {
                try {
                    UserAgent parsedUa = uaa.parse(userAgentHeader);
                    browser = parsedUa.getValue(UserAgent.AGENT_NAME);
                    os = parsedUa.getValue(UserAgent.OPERATING_SYSTEM_NAME);
                    deviceType = parsedUa.getValue(UserAgent.DEVICE_CLASS);
                } catch (Exception e) {
                    log.error("Failed to parse user agent: {}", e.getMessage());
                }
            }

            // 3. Resolve Country from IP
            String country = resolveCountry(ipAddress);

            // 4. Create and save click event
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setClickDate(LocalDateTime.now());
            clickEvent.setIpAddress(ipAddress);
            clickEvent.setCountry(country);
            clickEvent.setBrowser(browser);
            clickEvent.setOs(os);
            clickEvent.setDeviceType(deviceType);

            // Get a proxy reference to avoid loading UrlMapping from the database
            UrlMapping urlMappingReference = urlMappingRepository.getReferenceById(urlMappingId);
            clickEvent.setUrlMapping(urlMappingReference);

            clickEventRepository.save(clickEvent);
            log.info("Successfully logged click for urlMappingId: {} (Country: {}, Browser: {})", urlMappingId, country, browser);
        } catch (Exception e) {
            log.error("Error logging click asynchronously: ", e);
        }
    }

    private String resolveCountry(String ip) {
        if (ip == null || ip.isEmpty() || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            return "Localhost";
        }
        try {
            // Use free ip-api.com for resolution (with 2-second timeout)
            String url = "http://ip-api.com/json/" + ip;
            Map<?, ?> response = restTemplate.getForObject(url, Map.class);
            if (response != null && "success".equals(response.get("status"))) {
                return (String) response.get("country");
            }
        } catch (Exception e) {
            log.warn("Failed to resolve Geo-IP country for IP: {}. Error: {}", ip, e.getMessage());
        }
        return "Unknown";
    }
}
