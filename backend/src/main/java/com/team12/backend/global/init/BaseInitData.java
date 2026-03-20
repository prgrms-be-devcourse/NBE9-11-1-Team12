package com.team12.backend.global.init;

import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BaseInitData implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.save(new Product(
                    "Columbia Nariño",
                    5000
            ));

            productRepository.save(new Product(
                    "Brazil Serra Do Caparaó",
                    5000
            ));

            productRepository.save(new Product(
                    "Columbia Quindío (White Wine Extended Fermentation)",
                    5000
            ));

            productRepository.save(new Product(
                    "Ethiopia Sidamo",
                    5000
            ));
        }
    }
}
