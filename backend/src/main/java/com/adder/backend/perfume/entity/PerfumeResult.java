package com.adder.backend.perfume.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "perfume_results")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PerfumeResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String koreanName;

    private String englishName;

    @Column(length = 1000)
    private String summary;

    @Column(nullable = false)
    private String characterType;

    @Column(length = 500)
    private String noteSummary;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
