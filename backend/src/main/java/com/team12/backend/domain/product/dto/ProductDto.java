package com.team12.backend.domain.product.dto;

import com.team12.backend.domain.product.entity.Product;

import java.time.LocalDateTime;

public record ProductDto(
        int id,
        String name,
        int price,
        LocalDateTime createDate,
        LocalDateTime modifiedDate
) {
    public ProductDto(Product product) {
        this(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getCreatedDate(),
                product.getModifiedDate()
        );
    }
}