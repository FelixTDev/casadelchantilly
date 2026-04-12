package com.integrador.chantilly.pedido.repository;

import com.integrador.chantilly.pedido.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
}
