package com.integrador.chantilly.usuario.controller;

import com.integrador.chantilly.usuario.dto.DireccionDTO;
import com.integrador.chantilly.usuario.dto.UsuarioPerfilDTO;
import com.integrador.chantilly.usuario.service.UsuarioPerfilService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioPerfilService perfilService;

    public UsuarioController(UsuarioPerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioPerfilDTO> obtenerMiPerfil(Authentication auth) {
        return ResponseEntity.ok(perfilService.obtenerPerfil(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<Void> actualizarMiPerfil(Authentication auth, @RequestBody UsuarioPerfilDTO dto) {
        perfilService.actualizarPerfil(auth.getName(), dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/me/direcciones")
    public ResponseEntity<DireccionDTO> agregarDireccion(Authentication auth, @Valid @RequestBody DireccionDTO dto) {
        return ResponseEntity.ok(perfilService.agregarDireccion(auth.getName(), dto));
    }

    @DeleteMapping("/me/direcciones/{id}")
    public ResponseEntity<Void> eliminarDireccion(Authentication auth, @PathVariable Integer id) {
        perfilService.eliminarDireccion(auth.getName(), id);
        return ResponseEntity.ok().build();
    }
}
