package com.kaleidoscope314.boosterrockets.controllers;

import com.kaleidoscope314.boosterrockets.models.Role;
import com.kaleidoscope314.boosterrockets.models.User;
import com.kaleidoscope314.boosterrockets.models.data.RoleRepository;
import com.kaleidoscope314.boosterrockets.models.data.UserRepository;
import com.kaleidoscope314.boosterrockets.payload.request.LoginRequest;
import com.kaleidoscope314.boosterrockets.payload.request.RegisterRequest;
import com.kaleidoscope314.boosterrockets.payload.response.JwtResponse;
import com.kaleidoscope314.boosterrockets.payload.response.MessageResponse;
import com.kaleidoscope314.boosterrockets.security.services.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // it's not finding this!?!
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

import static com.kaleidoscope314.boosterrockets.models.ERole.ROLE_ADMIN;
import static com.kaleidoscope314.boosterrockets.models.ERole.ROLE_USER;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserAuthService userAuthService;

    @PostMapping("/register")
    // FIXME: temporarily removed @Valid from registerUser() due to javax.validation not importing
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signupRequest) {

        // check and see if user exists
        if (userRepository.findByName(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: An account with that email already exists"));
        }

        User user = new User(signupRequest.getFirstName(), signupRequest.getLastName(),
                signupRequest.getEmail(), encoder.encode(signupRequest.getPassword()));

        Set<Role> roles = new HashSet<>();

        // workaround to ensure ROLE_USER exists in database
        if (roleRepository.findByName(ROLE_USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setName(ROLE_USER);
            roleRepository.save(userRole);
            Role adminRole = new Role();
            adminRole.setName(ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        // Here we would check what role the newly registered user has and assign it accordingly.
        // For right now, just gives them the role user
        Role userRole = roleRepository.findByName(ROLE_USER).get();
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signupRequest.getEmail(), signupRequest.getPassword()));

        JwtResponse response = userAuthService.generateJwtResponse(authentication);

        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/login")
    // FIXME: temporarily removed @Valid from loginUser() due to javax.validation not importing
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {

        // generate an Authentication object to create token.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        JwtResponse response = userAuthService.generateJwtResponse(authentication);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
