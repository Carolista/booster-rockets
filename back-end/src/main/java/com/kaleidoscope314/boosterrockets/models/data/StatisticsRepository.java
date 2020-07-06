package com.kaleidoscope314.boosterrockets.models.data;

import com.kaleidoscope314.boosterrockets.models.Statistics;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticsRepository extends CrudRepository<Statistics, Integer> {
}
