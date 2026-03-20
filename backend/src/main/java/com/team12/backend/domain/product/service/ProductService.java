package com.team12.backend.domain.product.service;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(ProductDto::from)
                .toList();
    }
}
