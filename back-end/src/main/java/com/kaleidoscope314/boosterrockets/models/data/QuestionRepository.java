package com.kaleidoscope314.boosterrockets.models.data;

import com.kaleidoscope314.boosterrockets.models.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {
}
