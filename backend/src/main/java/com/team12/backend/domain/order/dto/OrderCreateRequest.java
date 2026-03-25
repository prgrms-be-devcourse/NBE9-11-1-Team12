package com.team12.backend.domain.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderCreateRequest(
        @Email String email,
        @NotEmpty String address,
        @NotEmpty String postcode,
        @NotEmpty @Valid List<OrderItemCreateRequest> orderItems) {
        public record OrderItemCreateRequest(
                       int productId,
                       @Min(1) int quantity) {
        }
}