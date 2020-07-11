package com.kaleidoscope314.boosterrockets.security.services;

import com.kaleidoscope314.boosterrockets.models.User;
import com.kaleidoscope314.boosterrockets.models.data.UserRepository;
import com.kaleidoscope314.boosterrockets.payload.response.JwtResponse;
import com.kaleidoscope314.boosterrockets.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserAuthService {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    // Returns true if user id matches email in token
    public boolean doesUserMatch(int id, String headerAuth) {

        // get token from authorization header and validate
        String token = getToken(headerAuth);

        if (headerAuth != null && jwtUtils.validateJwtToken(token)) {

            // gets the user's email address from the token
            String useremail = jwtUtils.getUserNameFromJwtToken(token);

            Optional<User> userOptional = userRepository.findByName(useremail);

            // ensure the user exists
            if (userOptional.isPresent()) {
                User theUser = userOptional.get();
                return theUser.getId() == id;
            }
        }
        return false;
    }

    // creates JwtResponse json containing user's login token
    public JwtResponse generateJwtResponse(Authentication authentication) {

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // pull UserDetails out of Authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> jwtRoles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), jwtRoles);
    }

    // gets the username from authorization header
    public String getUserName(String headerAuth) {

        String token = getToken(headerAuth);
        if (token != null && jwtUtils.validateJwtToken((token))) {
            return jwtUtils.getUserNameFromJwtToken(token);
        }
        return null;
    }

    // gets JWT token from authorization header
    // should only be called internal to UserAuthService
    private String getToken(String headerAuth) {
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(6);
        }
        return null;
    }
}
