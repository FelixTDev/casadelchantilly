package com.integrador.chantilly.producto.repository;

import com.integrador.chantilly.producto.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}
