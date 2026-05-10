package com.adder.backend.perfume.controller;

import com.adder.backend.perfume.dto.PerfumeChatRequest;
import com.adder.backend.perfume.dto.PerfumeChatResponse;
import com.adder.backend.perfume.service.PerfumeChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/perfume")
public class PerfumeChatController {

    private final PerfumeChatService perfumeChatService;

    public PerfumeChatController(PerfumeChatService perfumeChatService) {
        this.perfumeChatService = perfumeChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<PerfumeChatResponse> chat(
            @RequestBody PerfumeChatRequest request
    ) {
        String answer = perfumeChatService.createReply(request);
        return ResponseEntity.ok(new PerfumeChatResponse(answer));
    }
}