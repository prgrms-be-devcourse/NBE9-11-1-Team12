package com.team12.backend.domain.product.service;

import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용으로 설정
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(int id) {
        return productRepository.findById(id);
    }

    @Transactional
    public Product create(String name, int price){
        Product product = new Product(name, price);
        return productRepository.save(product);
    }

    @Transactional
    public Product modify(int id, String name, int price){
        // findById를 통해 상품을 가져오고, 없으면 예외를 발생시킵니다.
        Product product = findById(id).orElseThrow(() ->
                new IllegalArgumentException("해당 상품이 존재하지 않습니다. id=" + id));

        product.update(name, price);
        return product;
    }

    @Transactional
    public void delete(int id){
        Product product = findById(id).orElseThrow(() ->
                new IllegalArgumentException("해당 상품이 존재하지 않습니다. id=" + id));

        productRepository.delete(product);
    }
}