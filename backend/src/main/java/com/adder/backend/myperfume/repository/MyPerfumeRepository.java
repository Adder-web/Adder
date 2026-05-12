package com.adder.backend.myperfume.repository;

import com.adder.backend.auth.entity.User;
import com.adder.backend.myperfume.entity.MyPerfume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MyPerfumeRepository extends JpaRepository<MyPerfume, Long> {
    Page<MyPerfume> findByUserOrderBySavedAtDesc(User user, Pageable pageable);
    List<MyPerfume> findAllByUser(User user);
    Optional<MyPerfume> findByIdAndUser(Long id, User user);
}
