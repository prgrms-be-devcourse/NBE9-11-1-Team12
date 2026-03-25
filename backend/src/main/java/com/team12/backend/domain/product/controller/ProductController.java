package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductCreateRequest;
import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.dto.ProductModifyRequest;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import com.team12.backend.global.rsData.RsData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 사용자 상품 목록 조회
    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        List<Product> result = productService.findAll();

        return result.stream()
                .map(ProductDto::new)
                .toList();
    }

    // 관리자 상품 목록 조회
    @GetMapping("/admin/products")
    public List<ProductDto> productsList() {
        List<Product> result = productService.findAll();

        return result.stream()
                .map(ProductDto::new)
                .toList();
    }

    // 관리자 상품 상세 조회
    @GetMapping("/admin/products/{id}")
    public ProductDto detail(@PathVariable int id) {
        Product product = productService.findById(id);
        return new ProductDto(product);
    }

    @PostMapping("/admin/products")
    public ProductDto create(@Valid @RequestBody ProductCreateRequest request) {
        return productService.create(request.name(), request.price());
    }

    @PutMapping("/admin/products/{id}")
    public ProductDto modify(@PathVariable int id, @Valid @RequestBody ProductModifyRequest request) {
        return productService.modify(id, request.name(), request.price());
    }

    @DeleteMapping("/admin/products/{id}")
    public RsData<Void> delete(@PathVariable int id) {
        productService.delete(id);
        return new RsData<Void>("200", "삭제 성공");
    }
}