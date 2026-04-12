package com.integrador.chantilly.pago.dto;

import java.math.BigDecimal;

public class PagoDTO {
    private Integer id;
    private Integer pedidoId;
    private BigDecimal monto;
    private String estado;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getPedidoId() { return pedidoId; }
    public void setPedidoId(Integer pedidoId) { this.pedidoId = pedidoId; }
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
