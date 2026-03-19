package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
}
