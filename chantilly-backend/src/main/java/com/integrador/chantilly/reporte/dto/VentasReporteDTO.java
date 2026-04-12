package com.integrador.chantilly.reporte.dto;

import java.math.BigDecimal;

public class VentasReporteDTO {
    private String periodo;
    private Integer totalPedidos;
    private BigDecimal montoTotal;

    public String getPeriodo() { return periodo; }
    public void setPeriodo(String periodo) { this.periodo = periodo; }
    public Integer getTotalPedidos() { return totalPedidos; }
    public void setTotalPedidos(Integer totalPedidos) { this.totalPedidos = totalPedidos; }
    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }
}
