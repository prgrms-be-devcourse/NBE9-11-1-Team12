package com.team12.backend.domain.order.controller;


import com.team12.backend.domain.order.dto.AdminOrderResponse;
import com.team12.backend.domain.order.dto.OrderDto;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/{email}")
    public List<OrderDto> getOrdersByEmail(@PathVariable("email") String email){
        return orderService.getOrdersByEmail(email);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> cancelOrder(@PathVariable("orderId") int orderId){
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }


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
