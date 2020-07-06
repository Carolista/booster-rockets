package com.kaleidoscope314.boosterrockets.models;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Filters extends AbstractEntity {

    @Column
    @ElementCollection(targetClass=String.class)
    private List<String> categories = new ArrayList<>();

    @Column
    @ElementCollection(targetClass=String.class)
    private List<String> topics = new ArrayList<>();

    @Column
    @ElementCollection(targetClass=String.class)
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
