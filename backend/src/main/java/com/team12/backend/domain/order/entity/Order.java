package com.team12.backend.domain.order.entity;

import com.team12.backend.domain.customer.entity.Customer;
import com.team12.backend.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Order extends BaseEntity {

    @Column(nullable = false)
    private String address;

    @Column(length = 20, nullable = false)
    private String postcode;

    @Column(nullable = false)
    private boolean status;

    @Column(nullable = false)
    private int totalPrice;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "order",
            cascade = {CascadeType.PERSIST, CascadeType.REMOVE},
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public void addOrderItem(OrderItem orderItem) {
        totalPrice += orderItem.getPrice();
        orderItems.add(orderItem);
    }
}
