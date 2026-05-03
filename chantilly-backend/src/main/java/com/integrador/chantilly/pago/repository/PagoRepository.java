package com.integrador.chantilly.pago.repository;

import com.integrador.chantilly.pago.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
    Optional<Pago> findByPedidoId(Integer pedidoId);
}
