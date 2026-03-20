package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class ProductController {

    private final ProductService productService;

    // 관리자 상품 목록 조회
    @GetMapping
    public List<ProductDto> productsList() {
        List<Product> result = productService.findAll();

        List<ProductDto> productDtoList = result.stream()
                .map(ProductDto::new)
                .toList();

        return productDtoList;
    }

    // 관리자 상품 상세 조회
    @GetMapping("/{id}")
    public ProductDto detail(@PathVariable int id) {
        Product product = productService.findById(id).get();

        return new ProductDto(product);
    }
}
