package com.adder.backend.myperfume.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CharacterStatDto {
    private String characterType;
    private String name;
    private String role;
    private long count;
}
