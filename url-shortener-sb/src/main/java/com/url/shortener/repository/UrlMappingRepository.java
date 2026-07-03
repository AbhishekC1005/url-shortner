package com.url.shortener.repository;

import com.url.shortener.models.UrlMapping;
import com.url.shortener.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {
   UrlMapping findByShortUrl(String shortUrl);
   List<UrlMapping> findByUser(User user);
   void deleteByExpiresAtBefore(java.time.LocalDateTime dateTime);

   @org.springframework.data.jpa.repository.Modifying
   @org.springframework.data.jpa.repository.Query("UPDATE UrlMapping u SET u.clickCount = u.clickCount + 1 WHERE u.id = :id")
   void incrementClickCount(@org.springframework.data.repository.query.Param("id") Long id);
}
