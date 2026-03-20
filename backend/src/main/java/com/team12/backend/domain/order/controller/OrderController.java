package com.team12.backend.domain.order.controller;

import com.team12.backend.domain.order.dto.AdminOrderResponse;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/admin/orders")
    public List<AdminOrderResponse> getAdminOrders() {
        return orderService.getOrders()
                .stream().map(AdminOrderResponse::new).toList();
    }

     @PutMapping("/admin/orders/{id}/status")
     public AdminOrderResponse activateStatus(@PathVariable int id) {
        Order order = orderService.activateStatus(id);
        if (order == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new AdminOrderResponse(order);
     }
}
