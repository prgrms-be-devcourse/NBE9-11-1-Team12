package com.team12.backend.domain.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProductModifyRequest(
        @NotBlank(message = "상품 이름은 필수입니다.") String name,
        @Min(value = 0, message = "가격은 0원 이상이어야 합니다.") int price
) {
}
