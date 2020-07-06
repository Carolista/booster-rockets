package com.kaleidoscope314.boosterrockets.models.data;

import com.kaleidoscope314.boosterrockets.models.AbstractEntity;

import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Flashcard extends AbstractEntity {

    private String category;
    private String topic;
    private String type;
    private String query;
    private List<String> choices = new ArrayList<>();
    private String answer;

    public Flashcard() {}

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public List<String> getChoices() {
        return choices;
    }

    public void setChoices(List<String> choices) {
        this.choices = choices;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

}
