package com.team12.backend.domain.order.dto;

import com.team12.backend.domain.order.entity.OrderItem;

public record OrderItemDto (
        int productId,
        String productName,
        int quantity,
        int price
){
    public OrderItemDto(OrderItem orderItem){
        this(
                orderItem.getProduct().getId(),
                orderItem.getProduct().getName(),
                orderItem.getQuantity(),
                orderItem.getPrice()
        );
    }
}
