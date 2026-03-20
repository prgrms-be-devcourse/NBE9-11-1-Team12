package com.team12.backend.global.initData;

import com.team12.backend.domain.customer.entity.Customer;
import com.team12.backend.domain.customer.repository.CustomerRepository;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.entity.OrderItem;
import com.team12.backend.domain.order.repository.OrderRepository;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Profile;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class BaseInitData {

    @Autowired
    @Lazy
    private BaseInitData self;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Bean
    ApplicationRunner initDataRunner() {
        return args -> {

            self.work1();

        };

    }

    @Transactional
    public void work1() {
        if (customerRepository.count() == 0) {
            Customer customer = new Customer("test@test.com");
            customerRepository.save(customer);
        }

        if (productRepository.count() == 0) {
            Product product = new Product("product1", 1000);
            productRepository.save(product);
        }

        if (orderRepository.count() == 0) {
            Customer customer = customerRepository.findById(1).get();
            Product product = productRepository.findById(1).get();
            Order order = new Order(
                    "address", "postcode", false,
                    product.getPrice(), customer, new ArrayList<>());
            OrderItem orderItem = new OrderItem(1, product.getPrice(), order, product);
            order.addOrderItem(orderItem);
            orderRepository.save(order);
        }
    }
}
