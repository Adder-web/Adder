package com.adder.backend.myperfume.entity;

import com.adder.backend.auth.entity.User;
import com.adder.backend.perfume.entity.PerfumeResult;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "my_perfumes")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MyPerfume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id", nullable = false)
    private PerfumeResult perfumeResult;

    private String customName;

    @CreationTimestamp
    private LocalDateTime savedAt;

    public String getEffectiveName() {
        return (customName != null && !customName.isBlank()) ? customName : perfumeResult.getKoreanName();
    }

    public void updateCustomName(String customName) {
        this.customName = customName;
    }
}
