package com.team12.backend.domain.order.service;

import com.team12.backend.domain.order.dto.OrderDto;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

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
                .orElseThrow(()-> new IllegalArgumentException("주문 없음"));

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
        Optional<Order> optionalOrder = orderRepository.findById(id);
        if (optionalOrder.isEmpty()) {
            return null;
        }

        Order order = optionalOrder.get();
        order.activateStatus();
        return order;
    }
}
