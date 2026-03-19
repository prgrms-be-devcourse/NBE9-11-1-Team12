package com.team12.backend.domain.customer.entity;

import com.team12.backend.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customers")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Customer extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String email;
}
