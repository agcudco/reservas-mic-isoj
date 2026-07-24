package ec.edu.espe.master.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoleRequest {
    @NotBlank
    @Size(max = 25)
    private String name;
    private String description;
}
