package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
    public ProductDto create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request.getName(), request.getPrice());
    }

    @PutMapping("/admin/products/{id}")
    public ProductDto modify(@PathVariable int id, @Valid @RequestBody ProductRequest request) {
        return productService.modify(id, request.getName(), request.getPrice());
    }

    @DeleteMapping("/admin/products/{id}")
    public void delete(@PathVariable int id) {
        productService.delete(id);
    }

    public static class ProductRequest {
        @NotBlank(message = "상품 이름은 필수입니다.")
        private String name;

        @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
        private int price;

        public String getName() { return name; }
        public int getPrice() { return price; }
    }
}