package ec.edu.espe.master.services.impl;

import ec.edu.espe.master.dto.request.UserRequest;
import ec.edu.espe.master.dto.response.PersonResponse;
import ec.edu.espe.master.dto.response.UserResponse;
import ec.edu.espe.master.entity.*;
import ec.edu.espe.master.repository.PersonRepository;
import ec.edu.espe.master.repository.RoleRepository;
import ec.edu.espe.master.repository.UserRepository;
import ec.edu.espe.master.repository.UserRoleRepository;
import ec.edu.espe.master.services.UserService;
import jakarta.transaction.TransactionScoped;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServicesImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Override
    public UserResponse createUser(UserRequest userRequest) {

        if (personRepository.existsByDni(userRequest.getDni()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Dni already exists");

        if (personRepository.existsByEmail(userRequest.getEmail()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");

        Person objPerson = Person.builder()
                .dni(userRequest.getDni())
                .firstName(userRequest.getFirstName())
                .middleName(userRequest.getMiddleName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .phone(userRequest.getPhone())
                .nationality(userRequest.getNationality())
                .address(userRequest.getAddress())
                .build();

        objPerson = personRepository.save(objPerson);

        User objUser = User.builder()
                //.id(objPerson.getId())
                .person(objPerson)
                .username(objPerson.getFirstName())//crear funcion peersonalizada
                .passwordHash(objPerson.getDni())//crear funcion personalizada
                .active(true)
                .build();

        objUser = userRepository.save(objUser);

        return mapToUserResponse(objUser);
    }

    @Override
    public UserResponse updateUser(UserRequest userRequest, UUID userId) {
        return null;
    }

    @Override
    public void deleteUser(UUID userId) {

    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID userId) {
        User usr = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return mapToUserResponse(usr);
    }

    @Override
    public UserResponse assigneRole(UUID userId, UUID roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rol no encontrado"));

        if (userRoleRepository.existsByUserAndRole(user, role))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya tiene asignado este rol");

        UserRoleId urId = new UserRoleId(userId, roleId);

        UserRole userRole = UserRole.builder()
                .id(urId)
                .user(user)
                .role(role)
                .build();

        UserRole ur = userRoleRepository.save(userRole);

        return mapToUserResponse(ur.getUser());
    }

    @Override
    public void removeRole(UUID userId, UUID roleId) {

    }


    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> mapToUserResponse(user))
                .collect(Collectors.toList());
    }


    private UserResponse mapToUserResponse(User user) {
        List<String> roles = user.getUserRoles().stream()
                .filter(UserRole::getActive)
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        Person person = user.getPerson();
        PersonResponse personResponse = PersonResponse.builder()
                .id(person.getId())
                .dni(person.getDni())
                .firstName(person.getFirstName())
                .middleName(person.getMiddleName())
                .lastName(person.getLastName())
                .email(person.getEmail())
                .phone(person.getPhone())
                .address(person.getAddress())
                .nationality(person.getNationality())
                .active(person.getActive())
                .build();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .active(user.getActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .person(personResponse)
                .roles(roles)
                .build();
    }
}
