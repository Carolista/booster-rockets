package com.kaleidoscope314.boosterrockets.models.data;


import com.kaleidoscope314.boosterrockets.models.ERole;
import com.kaleidoscope314.boosterrockets.models.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer> {

    Optional<Role> findByName(ERole name);
}
