    package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/products")
public class ProductController {

    private final ProductService productService;


    public record ProductCreateReqBody(
            @NotBlank(message = "상품 이름을 비워둘 수 없습니다.")
            String name,
            @Min(value = 0, message = "가격은 0원 이상이어야 합니다.")
            Integer price
    ) {}

    @PostMapping
    @Operation(summary = "상품 등록", description = "새로운 상품을 등록합니다")
    public ProductDto create(@Valid @RequestBody ProductCreateReqBody reqBody) {
        Product product = productService.create(reqBody.name(), reqBody.price());
        return new ProductDto(product);
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품 수정", description = "상품을 수정합니다.")
    public ProductDto modify(@PathVariable int id, @Valid @RequestBody ProductCreateReqBody reqBody){
        Product product = productService.modify(id, reqBody.name(), reqBody.price());
        return new ProductDto(product);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제", description = "상품을 삭제합니다.")
    public void delete(@PathVariable int id){
        productService.delete(id);
    }
}
