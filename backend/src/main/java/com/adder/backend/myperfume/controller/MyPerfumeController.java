package com.adder.backend.myperfume.controller;

import com.adder.backend.common.ApiResponse;
import com.adder.backend.myperfume.dto.*;
import com.adder.backend.myperfume.service.MyPerfumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/my-perfumes")
@RequiredArgsConstructor
public class MyPerfumeController {

    private final MyPerfumeService myPerfumeService;

    @PostMapping
    public ResponseEntity<ApiResponse<SavePerfumeResponse>> save(
            Authentication authentication,
            @RequestBody SavePerfumeRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        SavePerfumeResponse response = myPerfumeService.save(userId, request);
        return ResponseEntity.status(201).body(ApiResponse.created("향수가 저장되었습니다.", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<MyPerfumeListResponse>> getList(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        Long userId = (Long) authentication.getPrincipal();
        MyPerfumeListResponse response = myPerfumeService.getList(userId, page, size);
        return ResponseEntity.ok(ApiResponse.ok("보관함 목록을 조회했습니다.", response));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<MyPageSummaryResponse>> getSummary(
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        MyPageSummaryResponse response = myPerfumeService.getSummary(userId);
        return ResponseEntity.ok(ApiResponse.ok("마이페이지 요약을 조회했습니다.", response));
    }

    @GetMapping("/{myPerfumeId}")
    public ResponseEntity<ApiResponse<MyPerfumeDetailResponse>> getDetail(
            Authentication authentication,
            @PathVariable Long myPerfumeId) {
        Long userId = (Long) authentication.getPrincipal();
        MyPerfumeDetailResponse response = myPerfumeService.getDetail(userId, myPerfumeId);
        return ResponseEntity.ok(ApiResponse.ok("보관함 상세를 조회했습니다.", response));
    }

    @PatchMapping("/{myPerfumeId}")
    public ResponseEntity<ApiResponse<Void>> updateName(
            Authentication authentication,
            @PathVariable Long myPerfumeId,
            @Valid @RequestBody UpdatePerfumeRequest request) {
        Long userId = (Long) authentication.getPrincipal();
        myPerfumeService.updateName(userId, myPerfumeId, request);
        return ResponseEntity.ok(ApiResponse.ok("향수명이 수정되었습니다.", null));
    }

    @DeleteMapping("/{myPerfumeId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            Authentication authentication,
            @PathVariable Long myPerfumeId) {
        Long userId = (Long) authentication.getPrincipal();
        myPerfumeService.delete(userId, myPerfumeId);
        return ResponseEntity.ok(ApiResponse.ok("향수가 삭제되었습니다.", null));
    }
}
