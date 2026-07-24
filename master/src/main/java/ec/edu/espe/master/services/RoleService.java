package ec.edu.espe.master.services;

import ec.edu.espe.master.dto.request.RoleRequest;
import ec.edu.espe.master.dto.response.RoleResponse;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    RoleResponse createRole(RoleRequest request);

    RoleResponse getRoleById(UUID id);

    List<RoleResponse> getAllRoles();

    RoleResponse updateRole(UUID id, RoleRequest request);

    void deleteRole(UUID id);
}
