package com.integrador.chantilly.carrito.repository;

import com.integrador.chantilly.carrito.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoRepository extends JpaRepository<Carrito, Integer> {
}
