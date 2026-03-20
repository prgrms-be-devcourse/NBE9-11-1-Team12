package com.team12.backend.domain.product.entity;

import com.team12.backend.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int price;

    // [생성자] 데이터를 처음 생성할 때 사용 (팀원 코드)
    public Product(String name, int price) {
        this.name = name;
        this.price = price;
    }

    // [수정 메서드] 데이터를 수정할 때 사용 (우호님 코드)
    public void update(String name, int price){
        this.name = name;
        this.price = price;
    }
}
