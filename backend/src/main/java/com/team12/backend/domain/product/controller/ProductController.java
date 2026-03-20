package com.team12.backend.domain.product.controller;

import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 프론트 연동 허용
public class ProductController {

    private final ProductService productService;

    @GetMapping("/products")
    public List<Product> list() {
        return productService.findAll();
    }

    @GetMapping("/admin/products")
    public List<Product> adminList() {
        return productService.findAll();
    }

    @PostMapping("/admin/products")
    public void create(@RequestBody ProductRequest request) {
        productService.create(request.getName(), request.getPrice());
    }

    @PutMapping("/admin/products/{id}")
    public void modify(@PathVariable int id, @RequestBody ProductRequest request) {
        productService.modify(id, request.getName(), request.getPrice());
    }

    @DeleteMapping("/admin/products/{id}")
    public void delete(@PathVariable int id) {
        productService.delete(id);
    }

    public static class ProductRequest {
        private String name;
        private int price;
        public String getName() { return name; }
        public int getPrice() { return price; }
    }
}