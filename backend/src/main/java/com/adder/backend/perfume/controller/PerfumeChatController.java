package com.adder.backend.perfume.controller;

import com.adder.backend.perfume.dto.PerfumeChatRequest;
import com.adder.backend.perfume.dto.PerfumeChatResponse;
import com.adder.backend.perfume.service.PerfumeChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfume")
@RequiredArgsConstructor
public class PerfumeChatController {

    private final PerfumeChatService perfumeChatService;

    @PostMapping("/chat")
    public PerfumeChatResponse chat(@Valid @RequestBody PerfumeChatRequest request) {
        return perfumeChatService.chat(
                request.getMessage(),
                request.getCharacterName()
        );
    }
}