package com.team12.backend.domain.order.service;

import com.team12.backend.domain.customer.entity.Customer;
import com.team12.backend.domain.customer.repository.CustomerRepository;
import com.team12.backend.domain.order.dto.OrdersCreateRequest;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.entity.OrderItem;
import com.team12.backend.domain.order.repository.OrderRepository;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(OrdersCreateRequest request) {

        // 기존 고객 조회, 없으면 생성 있으면 조회만하기
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseGet(() -> customerRepository.save(new Customer(request.getEmail())));

        // 주문 생성
        Order order = new Order(
                request.getAddress(),
                request.getPostcode(),
                false,
                0,
                customer,
                new ArrayList<>()
        );

        // 주문 처리
        for (OrdersCreateRequest.OrderItemDto item : request.getOrderItems()) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("상품 없음"));

            OrderItem orderItem = new OrderItem(
                    item.getQuantity(),
                    product.getPrice(),
                    order,
                    product
                );

            order.addOrderItem(orderItem);
        }

        return orderRepository.save(order);
    }
}
