package ec.edu.espe.master.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "El username es obligatorio")
    @Size(max = 15, message = "El username no puede tener más de 15 caracteres")
    private String username;

    @NotBlank
    private String password;

    //agregar validaciones
}
