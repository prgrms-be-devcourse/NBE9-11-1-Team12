package com.team12.backend.domain.order.dto;

import com.team12.backend.domain.order.entity.Order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        int id,
        String address,
        String postcode,
        boolean status,
        int totalPrice,
        LocalDateTime createdDate,
        LocalDateTime modifiedDate,
        List<OrderItemDto> orderItems
) {
    public OrderDto(Order order) {
        this(
                order.getId(),
                order.getAddress(),
                order.getPostcode(),
                order.isStatus(),
                order.getTotalPrice(),
                order.getCreatedDate(),
                order.getModifiedDate(),
                order.getOrderItems()!=null?
                        order.getOrderItems()
                                .stream()
                                .map(OrderItemDto::new)
                                .toList() :List.of()
        );
    }
}
