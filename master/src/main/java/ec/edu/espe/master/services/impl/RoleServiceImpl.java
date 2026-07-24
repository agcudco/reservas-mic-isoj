package ec.edu.espe.master.services.impl;

import ec.edu.espe.master.dto.request.RoleRequest;
import ec.edu.espe.master.dto.response.RoleResponse;
import ec.edu.espe.master.entity.Role;
import ec.edu.espe.master.repository.RoleRepository;
import ec.edu.espe.master.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByName(request.getName()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El nombre del rol ya existe");

        Role role = Role.builder()
                .id(UUID.randomUUID())
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();
        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponse getRoleById(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        return mapToResponse(role);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public RoleResponse updateRole(UUID id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        if (!role.getName().equals(request.getName()) && roleRepository.existsByName(request.getName()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nombre de rol ya en uso");

        role.setName(request.getName());
        role.setDescription(request.getDescription());
        role.setUpdatedAt(LocalDateTime.now());
        role = roleRepository.save(role);
        return mapToResponse(role);
    }

    @Override
    public void deleteRole(UUID id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));
        role.setActive(false);
        roleRepository.save(role);
    }

    private RoleResponse mapToResponse(Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .active(role.getActive())
                .createdAt(role.getCreatedAt())
                .build();
    }
}
