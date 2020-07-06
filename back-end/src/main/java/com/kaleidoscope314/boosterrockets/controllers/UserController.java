package com.kaleidoscope314.boosterrockets.controllers;

import com.kaleidoscope314.boosterrockets.models.User;
import com.kaleidoscope314.boosterrockets.models.data.UserRepository;
import com.kaleidoscope314.boosterrockets.security.services.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserAuthService userAuthService;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserById(@PathVariable("userId") int id, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if (userRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(id, headerAuth)) {
            return new ResponseEntity<>(userRepository.findById(id).get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateUser(@RequestBody User user, @PathVariable("userId") int id,
                                        @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if (userRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(id, headerAuth)) {

            if (user.getPassword() != null) {
                user.setPassword(encoder.encode(user.getPassword()));
            } else {
                user.setPassword(userRepository.findById(id).get().getPassword());
            }

            user.setRoles(userRepository.findById(id).get().getRoles());

            userRepository.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
