package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @ResponseBody
    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        return productService.getProducts();
    }
}
