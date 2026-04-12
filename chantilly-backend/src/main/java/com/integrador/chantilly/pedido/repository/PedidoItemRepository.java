package com.integrador.chantilly.pedido.repository;

import com.integrador.chantilly.pedido.entity.PedidoItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Integer> {
}
