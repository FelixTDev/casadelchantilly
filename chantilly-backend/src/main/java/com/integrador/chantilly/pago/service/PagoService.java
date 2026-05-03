package com.integrador.chantilly.pago.service;

import com.integrador.chantilly.pago.dto.PagoDTO;
import com.integrador.chantilly.pago.entity.Pago;
import com.integrador.chantilly.pago.repository.PagoRepository;
import com.integrador.chantilly.pedido.entity.Pedido;
import com.integrador.chantilly.pedido.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PagoService {

    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;

    public PagoService(PagoRepository pagoRepository, PedidoRepository pedidoRepository) {
        this.pagoRepository = pagoRepository;
        this.pedidoRepository = pedidoRepository;
    }

    @Transactional
    public PagoDTO registrarPago(Integer usuarioId, Integer pedidoId, PagoDTO dto) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("El pedido no pertenece al usuario");
        }

        Pago pago = pagoRepository.findByPedidoId(pedidoId).orElse(new Pago());
        pago.setPedido(pedido);
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setMonto(pedido.getTotal());
        pago.setReferencia(dto.getReferencia());
        pago.setEstadoPago("PENDIENTE");
        pago.setFechaPago(LocalDateTime.now());

        return toDto(pagoRepository.save(pago));
    }

    @Transactional
    public PagoDTO confirmarPago(Integer pagoId) {
        Pago pago = pagoRepository.findById(pagoId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));

        pago.setEstadoPago("CONFIRMADO");
        return toDto(pagoRepository.save(pago));
    }

    public PagoDTO obtenerPorPedido(Integer pedidoId, Integer usuarioId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        if (!pedido.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("El pedido no pertenece al usuario");
        }

        Pago pago = pagoRepository.findByPedidoId(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado para el pedido"));
        return toDto(pago);
    }

    private PagoDTO toDto(Pago pago) {
        PagoDTO dto = new PagoDTO();
        dto.setId(pago.getId());
        dto.setPedidoId(pago.getPedido().getId());
        dto.setMetodoPago(pago.getMetodoPago());
        dto.setEstadoPago(pago.getEstadoPago());
        dto.setMonto(pago.getMonto());
        dto.setReferencia(pago.getReferencia());
        dto.setFechaPago(pago.getFechaPago());
        return dto;
    }
}
