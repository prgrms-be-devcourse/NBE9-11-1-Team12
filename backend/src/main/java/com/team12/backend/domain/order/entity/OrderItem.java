package com.team12.backend.domain.order.entity;

import com.team12.backend.domain.product.entity.Product;
import com.team12.backend.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem extends BaseEntity {

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private int price;

    @ManyToOne
    @Setter
    private Order order;

    @ManyToOne
    private Product product;

    public int getSubTotal() {
        return price * quantity;
    }
}
