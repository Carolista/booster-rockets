package com.kaleidoscope314.boosterrockets.models;

import javax.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Filters extends AbstractEntity {


    private List<String> categories = new ArrayList<>();
    private List<String> topics = new ArrayList<>();
    private List<String> types = new ArrayList<>();

    public Filters() {}

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }

}
