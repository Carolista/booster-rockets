package com.kaleidoscope314.boosterrockets.models.data;

import com.kaleidoscope314.boosterrockets.models.Settings;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends CrudRepository<Settings, Integer> {
}
