package com.integrador.chantilly.usuario.service;

import com.integrador.chantilly.usuario.dto.DireccionDTO;
import com.integrador.chantilly.usuario.dto.UsuarioPerfilDTO;
import com.integrador.chantilly.usuario.entity.Direccion;
import com.integrador.chantilly.usuario.entity.Usuario;
import com.integrador.chantilly.usuario.repository.DireccionRepository;
import com.integrador.chantilly.usuario.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioPerfilService {

    private final UsuarioRepository usuarioRepository;
    private final DireccionRepository direccionRepository;

    public UsuarioPerfilService(UsuarioRepository usuarioRepository, DireccionRepository direccionRepository) {
        this.usuarioRepository = usuarioRepository;
        this.direccionRepository = direccionRepository;
    }

    public UsuarioPerfilDTO obtenerPerfil(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
        List<Direccion> direcciones = direccionRepository.findByUsuarioId(usuario.getId());

        UsuarioPerfilDTO dto = new UsuarioPerfilDTO();
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        
        List<DireccionDTO> dirDtos = direcciones.stream().map(d -> {
            DireccionDTO dDto = new DireccionDTO();
            dDto.setId(d.getId());
            dDto.setEtiqueta(d.getEtiqueta());
            dDto.setDireccion(d.getDireccion());
            dDto.setTelefono(d.getTelefono());
            return dDto;
        }).collect(Collectors.toList());
        
        dto.setDirecciones(dirDtos);
        
        return dto;
    }

    public void actualizarPerfil(String email, UsuarioPerfilDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setTelefono(dto.getTelefono());
        
        usuarioRepository.save(usuario);
    }

    public DireccionDTO agregarDireccion(String email, DireccionDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
        Direccion direccion = new Direccion();
        direccion.setEtiqueta(dto.getEtiqueta());
        direccion.setDireccion(dto.getDireccion());
        direccion.setTelefono(dto.getTelefono());
        direccion.setUsuario(usuario);
        
        Direccion guardada = direccionRepository.save(direccion);
        dto.setId(guardada.getId());
        return dto;
    }

    public void eliminarDireccion(String email, Integer direccionId) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                
        Direccion direccion = direccionRepository.findById(direccionId)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
                
        if (!direccion.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("No tiene permisos para eliminar esta dirección");
        }
        
        direccionRepository.delete(direccion);
    }
}
