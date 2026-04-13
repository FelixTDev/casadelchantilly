package com.integrador.chantilly.auth.service;

import com.integrador.chantilly.auth.dto.AuthResponse;
import com.integrador.chantilly.auth.dto.LoginRequest;
import com.integrador.chantilly.auth.dto.MessageResponse;
import com.integrador.chantilly.auth.dto.RecoverRequest;
import com.integrador.chantilly.auth.dto.RegisterRequest;
import com.integrador.chantilly.shared.security.JwtUtil;
import com.integrador.chantilly.usuario.entity.Role;
import com.integrador.chantilly.usuario.entity.Usuario;
import com.integrador.chantilly.usuario.repository.RoleRepository;
import com.integrador.chantilly.usuario.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public MessageResponse register(RegisterRequest req) {
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        Role rolCliente = roleRepository.findByNombre("CLIENTE")
                .orElseThrow(() -> new RuntimeException("Rol CLIENTE no configurado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(req.getNombre());
        usuario.setApellido(req.getApellido());
        usuario.setEmail(req.getEmail());
        usuario.setTelefono(req.getTelefono());
        usuario.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        usuario.setActivo(true);
        usuario.setRol(rolCliente);

        usuarioRepository.save(usuario);

        return new MessageResponse("Usuario registrado exitosamente");
    }

    public AuthResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(req.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", usuario.getId());
        claims.put("rol", usuario.getRol().getNombre());

        UserDetails userDetails = org.springframework.security.core.userdetails.User.withUsername(usuario.getEmail())
                .password(usuario.getPasswordHash())
                .authorities(usuario.getRol().getNombre())
                .build();

        String token = jwtUtil.generateToken(userDetails, claims);

        return new AuthResponse(
                token,
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getRol().getNombre()
        );
    }

    public MessageResponse recuperarPassword(RecoverRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email no encontrado"));

        usuario.setTokenRecuperacion(UUID.randomUUID().toString());
        usuario.setTokenExpiracion(LocalDateTime.now().plusHours(1));
        usuarioRepository.save(usuario);

        return new MessageResponse(usuario.getTokenRecuperacion()); // Changed string to return token directly for the mock! 
    }

    public MessageResponse resetPassword(com.integrador.chantilly.auth.dto.ResetPasswordRequest req) {
        Usuario usuario = usuarioRepository.findByTokenRecuperacion(req.getToken())
                .orElseThrow(() -> new RuntimeException("Enlace inválido o expirado"));

        if (usuario.getTokenExpiracion() == null || usuario.getTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El enlace de recuperación ha expirado");
        }

        usuario.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        usuario.setTokenRecuperacion(null);
        usuario.setTokenExpiracion(null);
        
        usuarioRepository.save(usuario);
        return new MessageResponse("Contraseña actualizada exitosamente");
    }
}
