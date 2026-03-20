package com.team12.backend.domain.order.controller;

import com.team12.backend.domain.order.dto.OrdersCreateRequest;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody OrdersCreateRequest request) {
        return orderService.createOrder(request);
    }
}
