package com.integrador.chantilly.carrito.dto;

public class CarritoItemDTO {
    private Integer id;
    private Integer carritoId;
    private Integer productoId;
    private Integer cantidad;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getCarritoId() { return carritoId; }
    public void setCarritoId(Integer carritoId) { this.carritoId = carritoId; }
    public Integer getProductoId() { return productoId; }
    public void setProductoId(Integer productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
