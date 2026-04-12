package com.integrador.chantilly.pago.repository;

import com.integrador.chantilly.pago.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepository extends JpaRepository<Pago, Integer> {
}
