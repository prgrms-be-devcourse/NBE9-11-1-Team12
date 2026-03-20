    package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import com.team12.backend.global.rsData.RsData;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/products")
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
    public RsData<ProductDto> create(@Valid @RequestBody ProductCreateReqBody reqBody){
        Product product = productService.create(reqBody.name(), reqBody.price());
        return new RsData<>("200-1",
                "[%s] 상품이 등록 되었습니다.".formatted(product.getName()),new ProductDto(product));
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품 수정", description = "상품을 수정합니다.")
    public RsData<ProductDto> modify(@PathVariable int id, @Valid @RequestBody ProductCreateReqBody reqBody){
        Product product = productService.modify(id, reqBody.name(), reqBody.price());
        return new RsData<>("200-2",
                "[%s] 상품이 수정 되었습니다.".formatted(product.getName()),new ProductDto(product));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "상품 삭제", description = "상품을 삭제합니다.")
    public RsData<Integer> delete(@PathVariable int id){
        productService.delete(id);
        return new RsData<>("200-3",
                "%d번 상품이 삭제 되었습니다.".formatted(id), id);
    }
}
