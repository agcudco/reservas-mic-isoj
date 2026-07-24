package ec.edu.espe.master.controller;

import ec.edu.espe.master.dto.request.UserRequest;
import ec.edu.espe.master.dto.response.UserResponse;
import ec.edu.espe.master.entity.User;
import ec.edu.espe.master.security.UserDetailsImpl;
import ec.edu.espe.master.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Un usuario puede ver sus propios datos, ADMIN puede ver cualquier usuario
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UserResponse> getUser(@PathVariable("userId") UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Endpoint para que cualquier usuario vea su propio perfil
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(userService.getUserById(userDetails.getId()));
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        // UserResponse resp = userService.createUser(userRequest);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                //        .body(resp);
                .body(userService.createUser(userRequest));
    }

    // Solo ADMIN puede actualizar usuarios
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request, id));
    }

    // Solo ADMIN puede asignar roles
    @PostMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> assigneRole(@PathVariable UUID userId, @PathVariable UUID roleId) {
        return ResponseEntity
                .ok(userService.assigneRole(userId, roleId));
    }

    // Solo ADMIN puede quitar roles
    @DeleteMapping("/{userId}/roles/{roleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeRole(@PathVariable UUID userId, @PathVariable UUID roleId) {
        userService.removeRole(userId, roleId);
        return ResponseEntity.noContent().build();
    }


}
