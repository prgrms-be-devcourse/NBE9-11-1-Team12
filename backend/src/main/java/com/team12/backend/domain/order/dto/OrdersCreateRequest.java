package com.team12.backend.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
public class OrdersCreateRequest {

    private String email;
    private String address;
    private String postcode;
    private List<OrderItemDto> orderItems;

    @Getter
    @Setter
    public static class OrderItemDto {
        private Integer productId;
        private int quantity;
    }
}