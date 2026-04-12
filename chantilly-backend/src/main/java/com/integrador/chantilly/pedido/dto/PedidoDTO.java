package com.integrador.chantilly.pedido.dto;

import java.math.BigDecimal;

public class PedidoDTO {
    private Integer id;
    private Integer usuarioId;
    private String estado;
    private BigDecimal total;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}
