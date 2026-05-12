package com.adder.backend.myperfume.service;

import com.adder.backend.auth.entity.User;
import com.adder.backend.auth.repository.UserRepository;
import com.adder.backend.myperfume.dto.*;
import com.adder.backend.myperfume.entity.MyPerfume;
import com.adder.backend.myperfume.repository.MyPerfumeRepository;
import com.adder.backend.perfume.entity.PerfumeResult;
import com.adder.backend.perfume.repository.PerfumeResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPerfumeService {

    private final MyPerfumeRepository myPerfumeRepository;
    private final PerfumeResultRepository perfumeResultRepository;
    private final UserRepository userRepository;

    private static final Map<String, String[]> CHARACTER_INFO = Map.of(
            "homa", new String[]{"호마", "Curiosity Perfumer"},
            "algo", new String[]{"알고", "Logical Perfumer"},
            "move", new String[]{"무브", "Vibe Perfumer"},
            "orion", new String[]{"오리온", "Intuitive Perfumer"}
    );

    private static final Map<String, String> CHARACTER_THUMBNAIL = Map.of(
            "homa", "#B5EBDC",
            "algo", "#D8D2FF",
            "move", "#BFDBFE",
            "orion", "#FED7AA"
    );

    @Transactional
    public SavePerfumeResponse save(Long userId, SavePerfumeRequest request) {
        User user = findUser(userId);
        PerfumeResult result = perfumeResultRepository.findById(request.getResultId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 향수 결과입니다."));

        MyPerfume saved = myPerfumeRepository.save(MyPerfume.builder()
                .user(user)
                .perfumeResult(result)
                .customName(request.getCustomName())
                .build());

        return SavePerfumeResponse.builder()
                .myPerfumeId(saved.getId())
                .perfumeName(saved.getEffectiveName())
                .savedAt(saved.getSavedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public MyPerfumeListResponse getList(Long userId, int page, int size) {
        User user = findUser(userId);
        Page<MyPerfume> resultPage = myPerfumeRepository.findByUserOrderBySavedAtDesc(
                user, PageRequest.of(page, size));

        List<MyPerfumeItemDto> items = resultPage.getContent().stream()
                .map(this::toItemDto)
                .collect(Collectors.toList());

        return MyPerfumeListResponse.builder()
                .items(items)
                .page(page)
                .size(size)
                .totalElements(resultPage.getTotalElements())
                .totalPages(resultPage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public MyPerfumeDetailResponse getDetail(Long userId, Long myPerfumeId) {
        User user = findUser(userId);
        MyPerfume myPerfume = myPerfumeRepository.findByIdAndUser(myPerfumeId, user)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 보관함 항목입니다."));
        return toDetailDto(myPerfume);
    }

    @Transactional
    public void updateName(Long userId, Long myPerfumeId, UpdatePerfumeRequest request) {
        User user = findUser(userId);
        MyPerfume myPerfume = myPerfumeRepository.findByIdAndUser(myPerfumeId, user)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 보관함 항목입니다."));
        myPerfume.updateCustomName(request.getCustomName());
    }

    @Transactional
    public void delete(Long userId, Long myPerfumeId) {
        User user = findUser(userId);
        MyPerfume myPerfume = myPerfumeRepository.findByIdAndUser(myPerfumeId, user)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 보관함 항목입니다."));
        myPerfumeRepository.delete(myPerfume);
    }

    @Transactional(readOnly = true)
    public MyPageSummaryResponse getSummary(Long userId) {
        User user = findUser(userId);
        List<MyPerfume> all = myPerfumeRepository.findAllByUser(user);

        long completedPerfumes = all.size();
        long uniqueCharacters = all.stream()
                .map(mp -> mp.getPerfumeResult().getCharacterType())
                .distinct().count();

        Map<String, Long> characterCounts = all.stream()
                .collect(Collectors.groupingBy(
                        mp -> mp.getPerfumeResult().getCharacterType(),
                        Collectors.counting()));

        List<CharacterStatDto> topCharacters = characterCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> {
                    String[] info = CHARACTER_INFO.getOrDefault(e.getKey(), new String[]{e.getKey(), ""});
                    return CharacterStatDto.builder()
                            .characterType(e.getKey())
                            .name(info[0])
                            .role(info[1])
                            .count(e.getValue())
                            .build();
                })
                .collect(Collectors.toList());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, Integer> heatmap = all.stream()
                .collect(Collectors.groupingBy(
                        mp -> mp.getSavedAt().format(fmt),
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)));

        return MyPageSummaryResponse.builder()
                .completedPerfumes(completedPerfumes)
                .uniqueCharacters(uniqueCharacters)
                .chatCount(completedPerfumes)
                .topCharacters(topCharacters)
                .heatmap(heatmap)
                .build();
    }

    private MyPerfumeItemDto toItemDto(MyPerfume mp) {
        PerfumeResult result = mp.getPerfumeResult();
        return MyPerfumeItemDto.builder()
                .myPerfumeId(mp.getId())
                .perfumeName(mp.getEffectiveName())
                .summary(result.getSummary())
                .noteSummary(result.getNoteSummary())
                .characterType(result.getCharacterType())
                .thumbnailColor(CHARACTER_THUMBNAIL.getOrDefault(result.getCharacterType(), "#E8E4FF"))
                .savedAt(mp.getSavedAt())
                .build();
    }

    private MyPerfumeDetailResponse toDetailDto(MyPerfume mp) {
        PerfumeResult result = mp.getPerfumeResult();
        return MyPerfumeDetailResponse.builder()
                .myPerfumeId(mp.getId())
                .perfumeName(mp.getEffectiveName())
                .summary(result.getSummary())
                .noteSummary(result.getNoteSummary())
                .characterType(result.getCharacterType())
                .thumbnailColor(CHARACTER_THUMBNAIL.getOrDefault(result.getCharacterType(), "#E8E4FF"))
                .savedAt(mp.getSavedAt())
                .build();
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
}
