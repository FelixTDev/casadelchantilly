package com.integrador.chantilly.producto.repository;

import com.integrador.chantilly.producto.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}
