package com.integrador.chantilly;

import com.integrador.chantilly.usuario.entity.Role;
import com.integrador.chantilly.usuario.entity.Usuario;
import com.integrador.chantilly.usuario.repository.RoleRepository;
import com.integrador.chantilly.usuario.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ChantillyApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChantillyApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedRolesAndAdmin(RoleRepository roleRepository,
												UsuarioRepository usuarioRepository,
												PasswordEncoder passwordEncoder) {
		return args -> {
			Role adminRole = roleRepository.findByNombre("ADMIN")
					.orElseGet(() -> roleRepository.save(new Role("ADMIN")));
			roleRepository.findByNombre("CLIENTE")
					.orElseGet(() -> roleRepository.save(new Role("CLIENTE")));

			if (!usuarioRepository.existsByEmail("admin@chantilly.com")) {
				Usuario admin = new Usuario();
				admin.setNombre("Admin");
				admin.setApellido("Chantilly");
				admin.setEmail("admin@chantilly.com");
				admin.setPasswordHash(passwordEncoder.encode("Admin123*"));
				admin.setTelefono("");
				admin.setActivo(true);
				admin.setRol(adminRole);
				usuarioRepository.save(admin);
			}
		};
	}
}
