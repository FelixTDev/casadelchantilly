package com.integrador.chantilly.usuario.controller;

import com.integrador.chantilly.usuario.dto.DireccionDTO;
import com.integrador.chantilly.usuario.dto.UsuarioPerfilDTO;
import com.integrador.chantilly.usuario.service.UsuarioPerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioPerfilService perfilService;

    public UsuarioController(UsuarioPerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioPerfilDTO> obtenerPerfil(Authentication auth) {
        return ResponseEntity.ok(perfilService.obtenerPerfil(auth.getName()));
    }

    @PutMapping("/perfil")
    public ResponseEntity<Void> actualizarPerfil(Authentication auth, @Valid @RequestBody UsuarioPerfilDTO dto) {
        perfilService.actualizarPerfil(auth.getName(), dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/direcciones")
    public ResponseEntity<List<DireccionDTO>> listarDirecciones(Authentication auth) {
        return ResponseEntity.ok(perfilService.listarDirecciones(auth.getName()));
    }

    @PostMapping("/direcciones")
    public ResponseEntity<DireccionDTO> agregarDireccion(Authentication auth, @Valid @RequestBody DireccionDTO dto) {
        return ResponseEntity.ok(perfilService.agregarDireccion(auth.getName(), dto));
    }

    @PutMapping("/direcciones/{id}")
    public ResponseEntity<DireccionDTO> actualizarDireccion(Authentication auth,
                                                           @PathVariable Integer id,
                                                           @Valid @RequestBody DireccionDTO dto) {
        return ResponseEntity.ok(perfilService.actualizarDireccion(auth.getName(), id, dto));
    }

    @DeleteMapping("/direcciones/{id}")
    public ResponseEntity<Void> eliminarDireccion(Authentication auth, @PathVariable Integer id) {
        perfilService.eliminarDireccion(auth.getName(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilDTO> obtenerMiPerfilCompat(Authentication auth) {
        return obtenerPerfil(auth);
    }

    @PutMapping("/me")
    public ResponseEntity<Void> actualizarMiPerfilCompat(Authentication auth, @Valid @RequestBody UsuarioPerfilDTO dto) {
        return actualizarPerfil(auth, dto);
    }

    @PostMapping("/me/direcciones")
    public ResponseEntity<DireccionDTO> agregarDireccionCompat(Authentication auth, @Valid @RequestBody DireccionDTO dto) {
        return agregarDireccion(auth, dto);
    }

    @DeleteMapping("/me/direcciones/{id}")
    public ResponseEntity<Void> eliminarDireccionCompat(Authentication auth, @PathVariable Integer id) {
        return eliminarDireccion(auth, id);
    }
}
