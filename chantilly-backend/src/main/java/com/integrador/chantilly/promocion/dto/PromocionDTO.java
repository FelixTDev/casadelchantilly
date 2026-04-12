package com.integrador.chantilly.promocion.dto;

import java.math.BigDecimal;

public class PromocionDTO {
    private Integer id;
    private String nombre;
    private String descripcion;
    private BigDecimal descuento;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getDescuento() { return descuento; }
    public void setDescuento(BigDecimal descuento) { this.descuento = descuento; }
}
