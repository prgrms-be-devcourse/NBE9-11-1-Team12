package com.team12.backend.domain.product.dto;

import com.team12.backend.domain.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductDto {

    private int id;
    private String name;
    private int price;

    public static ProductDto from(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getPrice()
        );
    }
}
