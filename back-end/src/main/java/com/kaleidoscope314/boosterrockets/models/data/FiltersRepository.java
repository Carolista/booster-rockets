package com.kaleidoscope314.boosterrockets.models.data;

import com.kaleidoscope314.boosterrockets.models.Filters;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiltersRepository extends CrudRepository<Filters, Integer> {
}
