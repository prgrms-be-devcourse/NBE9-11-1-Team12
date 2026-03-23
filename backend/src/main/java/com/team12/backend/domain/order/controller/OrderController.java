package com.team12.backend.domain.order.controller;

import com.team12.backend.domain.order.dto.AdminOrderResponse;
import com.team12.backend.domain.order.dto.OrderDto;
import com.team12.backend.domain.order.dto.OrdersCreateRequest;
import com.team12.backend.domain.order.entity.Order;
import com.team12.backend.domain.order.service.OrderService;
import com.team12.backend.global.rsData.RsData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public Order createOrder(@RequestBody OrdersCreateRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping("/orders/{email}")
    public List<OrderDto> getOrdersByEmail(@PathVariable("email") String email){
        return orderService.getOrdersByEmail(email);
    }

    @DeleteMapping("/orders/{orderId}")
    public RsData<Void> cancelOrder(@PathVariable("orderId") int orderId){
        orderService.deleteOrder(orderId);
        return new RsData<>("200-1", "주문 취소 성공");
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
