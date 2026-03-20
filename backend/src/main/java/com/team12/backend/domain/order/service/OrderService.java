package com.team12.backend.domain.order.service;

import com.team12.backend.domain.customer.entity.Customer;
import com.team12.backend.domain.customer.repository.CustomerRepository;
import com.team12.backend.domain.order.dto.OrdersCreateRequest;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.entity.OrderItem;
import com.team12.backend.domain.order.repository.OrderItemRepository;
import com.team12.backend.domain.order.repository.OrderRepository;
import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public Order createOrder(OrdersCreateRequest request) {

        // 기존 고객 조회, 없으면 생성 있으면 조회만하기
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    Customer newCustomer = new Customer();
                    newCustomer.setEmail(request.getEmail());
                    return customerRepository.save(newCustomer);
                });

        // 생성
        Order order = new Order();
        order.setCustomer(customer);
        order.setAddress(request.getAddress());
        order.setPostcode(request.getPostcode());
        order.setStatus(false);
        order.setTotalPrice(0);

        Order savedOrder = orderRepository.save(order);

        int totalPrice = 0;

        // 처리
        for (OrdersCreateRequest.OrderItemDto item : request.getOrderItems()) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("상품 없음"));

            int price = product.getPrice() * item.getQuantity();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPrice(price);

            orderItemRepository.save(orderItem);

            totalPrice += price;
        }

        // 총금액 저장
        savedOrder.setTotalPrice(totalPrice);
        return orderRepository.save(savedOrder);
    }
}
