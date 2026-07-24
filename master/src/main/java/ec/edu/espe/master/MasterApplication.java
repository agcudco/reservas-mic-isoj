package ec.edu.espe.master;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MasterApplication {
    public static void main(String[] args) {
        SpringApplication.run(MasterApplication.class, args);
        System.out.println("🚀 Servidor Spring Boot ejecutándose en http://localhost:8080");
        System.out.println("📚 Swagger disponible en http://localhost:8080/swagger-ui.html");
    }
}
