package com.team12.backend.domain.order.dto;

import com.team12.backend.domain.order.entity.Order;

import java.time.LocalDateTime;

public record AdminOrderResponse(
        int id,
        String customerEmail,
        String address,
        String postcode,
        boolean status,
        int totalPrice,
        LocalDateTime createdDate,
        LocalDateTime modifiedDate) {

    public AdminOrderResponse(Order order) {
        this(
                order.getId(),
                order.getCustomer().getEmail(),
                order.getAddress(),
                order.getPostcode(),
                order.isStatus(),
                order.getTotalPrice(),
                order.getCreatedDate(),
                order.getModifiedDate());
    }
}
