package ec.edu.espe.master.config;

import ec.edu.espe.master.entity.*;
import ec.edu.espe.master.repository.PersonRepository;
import ec.edu.espe.master.repository.RoleRepository;
import ec.edu.espe.master.repository.UserRepository;
import ec.edu.espe.master.repository.UserRoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DateSeeder implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PersonRepository personRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {

        if (roleRepository.count() > 0 || userRepository.count() > 0) {
            log.info("Los datos de prueba ya existen. Se omite la inicialización.");
            return;
        }

        log.info("Inicializando datos de prueba...");

        // 1. Crear roles
        Role adminRole = createRole("ADMIN", "Administrador del sistema");
        Role userRole = createRole("USER", "Usuario estándar");
        Role empleadoRole = createRole("EMPLEADO", "Empleado estándar");

        // 2. Crear usuario administrador
        createUserWithRoles(
                "1234567890", "Admin", "", "Principal",
                "admin@espe.edu.ec", "0991111111", "Calle Falsa 123",
                "Ecuatoriana", "admin", "admin123",
                adminRole
        );

        // 3. Crear usuario estándar
        createUserWithRoles(
                "0987654321", "Juan", "Carlos", "Pérez",
                "juan@espe.edu.ec", "0992222222", "Av. Amazonas 456",
                "Ecuatoriana", "jperez", "user123",
                userRole, empleadoRole
        );

        log.info("Datos de prueba creados exitosamente.");
    }

    private Role createRole(String name, String description) {
        Role role = Role.builder()
                //.id(UUID.randomUUID())
                .name(name)
                .description(description)
                .active(true)
                .build();
        return roleRepository.save(role);
    }

    private void createUserWithRoles(String dni, String firstName, String middleName, String lastName,
                                     String email, String phone, String address, String nationality,
                                     String username, String rawPassword, Role... roles) {

        // Crear Person
        Person person = Person.builder()
                //.id(UUID.randomUUID())
                .dni(dni)
                .firstName(firstName)
                .middleName(middleName)
                .lastName(lastName)
                .email(email)
                .phone(phone)
                .address(address)
                .nationality(nationality)
                .active(true)
                .build();
        person = personRepository.save(person);

        // Crear User (el id se asigna automáticamente por @MapsId)
        User user = User.builder()
                .person(person)
                .username(username)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .active(true)
                .tokenVersion(0L)
                .build();
        user = userRepository.save(user);

        // Asignar roles
        for (Role role : roles) {
            UserRoleId userRoleId = new UserRoleId(user.getId(), role.getId());
            UserRole userRole = UserRole.builder()
                    .id(userRoleId)
                    .user(user)
                    .role(role)
                    .active(true)
                    .build();
            userRoleRepository.save(userRole);
        }

        log.info("Usuario '{}' creado con rol(es): {}",
                username, java.util.Arrays.stream(roles).map(Role::getName).toList());
    }
}
