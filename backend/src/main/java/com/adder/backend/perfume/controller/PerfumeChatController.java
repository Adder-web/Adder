package com.adder.backend.perfume.controller;

import com.adder.backend.perfume.dto.PerfumeChatRequest;
import com.adder.backend.perfume.dto.PerfumeChatResponse;
import com.adder.backend.perfume.dto.PerfumeResultRequest;
import com.adder.backend.perfume.dto.PerfumeResultResponse;
import com.adder.backend.perfume.entity.PerfumeResult;
import com.adder.backend.perfume.repository.PerfumeResultRepository;
import com.adder.backend.perfume.service.PerfumeChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/perfume")
public class PerfumeChatController {

    private final PerfumeChatService perfumeChatService;
    private final PerfumeResultRepository perfumeResultRepository;

    public PerfumeChatController(PerfumeChatService perfumeChatService,
                                 PerfumeResultRepository perfumeResultRepository) {
        this.perfumeChatService = perfumeChatService;
        this.perfumeResultRepository = perfumeResultRepository;
    }

    @PostMapping("/chat")
    public ResponseEntity<PerfumeChatResponse> chat(
            @RequestBody PerfumeChatRequest request
    ) {
        String answer = perfumeChatService.createReply(request);
        return ResponseEntity.ok(new PerfumeChatResponse(answer));
    }

    @PostMapping("/result")
    public ResponseEntity<PerfumeResultResponse> result(
            @RequestBody PerfumeResultRequest request
    ) {
        PerfumeResultResponse result = perfumeChatService.createResult(request);

        String noteSummary = result.getNotes() == null ? "" :
                result.getNotes().stream()
                        .map(PerfumeResultResponse.ScentNote::getName)
                        .collect(Collectors.joining(" · "));

        PerfumeResult saved = perfumeResultRepository.save(PerfumeResult.builder()
                .koreanName(result.getKoreanName() != null ? result.getKoreanName() : "나의 향")
                .englishName(result.getEnglishName())
                .summary(result.getSummary())
                .characterType(result.getCharacterType() != null ? result.getCharacterType() : "homa")
                .noteSummary(noteSummary)
                .build());

        result.setResultId(saved.getId());
        return ResponseEntity.ok(result);
    }
}
