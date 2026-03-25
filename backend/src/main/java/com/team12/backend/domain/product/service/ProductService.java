package com.team12.backend.domain.product.service;

import com.team12.backend.domain.product.dto.ProductDto;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Transactional
    public ProductDto create(String name, int price) {
        Product product = new Product(name, price);
        Product savedProduct = productRepository.save(product);
        return new ProductDto(savedProduct);
    }

    @Transactional
    public ProductDto modify(int id, String name, int price) {
        Product product = findById(id);
        product.update(name, price);
        return new ProductDto(product);
    }

    @Transactional
    public void delete(int id){
        Product product = findById(id);
        productRepository.delete(product);
    }

    public Product findById(int id){
        return productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("상품 없음"));
    }
}
