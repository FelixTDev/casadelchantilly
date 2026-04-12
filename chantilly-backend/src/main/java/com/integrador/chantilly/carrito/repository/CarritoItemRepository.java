package com.integrador.chantilly.carrito.repository;

import com.integrador.chantilly.carrito.entity.CarritoItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoItemRepository extends JpaRepository<CarritoItem, Integer> {
}
