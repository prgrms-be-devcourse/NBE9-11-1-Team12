package com.team12.backend.domain.order.service;

import com.team12.backend.domain.customer.entity.Customer;
import com.team12.backend.domain.customer.repository.CustomerRepository;
import com.team12.backend.domain.order.dto.OrderCreateRequest;
import com.team12.backend.domain.order.dto.OrderDto;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.entity.OrderItem;
import com.team12.backend.domain.order.repository.OrderRepository;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Order createOrder(OrderCreateRequest request) {

        // 기존 고객 조회, 없으면 생성 있으면 조회만하기
        Customer customer = customerRepository.findByEmail(request.email())
                .orElseGet(() -> customerRepository.save(new Customer(request.email())));

        // 주문 생성
        Order order = new Order(
                request.address(),
                request.postcode(),
                false,
                0,
                customer,
                new ArrayList<>()
        );

        // 주문 처리
        for (OrderCreateRequest.OrderItemCreateRequest item : request.orderItems()) {

            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new NoSuchElementException("상품 없음"));

            OrderItem orderItem = new OrderItem(
                    item.quantity(),
                    product.getPrice(),
                    order,
                    product
                );

            order.addOrderItem(orderItem);
        }

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getOrdersByEmail(String email){
        return  orderRepository.findByCustomerEmail(email).
                stream()
                .map(OrderDto::new)
                .toList();
    }

    @Transactional
    public void deleteOrder(int orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(()-> new NoSuchElementException("존재하지 않는 주문"));

        if(order.isStatus()){
            throw new IllegalStateException("배송완료 주문");
        }

        orderRepository.delete(order);
    }

    public List<Order> getOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order activateStatus(int id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 주문"));

        order.activateStatus();
        return order;
    }
}
