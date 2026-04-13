package com.integrador.chantilly.usuario.dto;

import java.util.List;

public class UsuarioPerfilDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private List<DireccionDTO> direcciones;

    // Getters and Setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public List<DireccionDTO> getDirecciones() { return direcciones; }
    public void setDirecciones(List<DireccionDTO> direcciones) { this.direcciones = direcciones; }
}
