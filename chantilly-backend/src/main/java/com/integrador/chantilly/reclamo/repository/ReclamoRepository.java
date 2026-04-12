package com.integrador.chantilly.reclamo.repository;

import com.integrador.chantilly.reclamo.entity.Reclamo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReclamoRepository extends JpaRepository<Reclamo, Integer> {
}
