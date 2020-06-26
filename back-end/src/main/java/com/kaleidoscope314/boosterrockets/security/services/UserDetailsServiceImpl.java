package com.kaleidoscope314.boosterrockets.security.services;

import com.kaleidoscope314.boosterrockets.models.User;
import com.kaleidoscope314.boosterrockets.models.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class UserDetailsServiceImpl {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // gets the user from the database
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User " + username +" not found."));

        return UserDetailsImpl.build(user);
    }
}
