package com.kaleidoscope314.boosterrockets.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Question extends AbstractEntity {

    @ManyToOne
    @JoinColumn(name = "user_id", updatable = false, insertable = false)
    @JsonBackReference
    private User user;

    // refers to id of flashcard object in questionBank.json TODO: move from front to back?
    private int cardId;

    private int presented;
    private int correct;
    private boolean archived;

    public Question() {}

    public Question(User user, int cardId, int presented, int correct, boolean archived) {
        this.user = user;
        this.cardId = cardId;
    }
    public Question(User user) {
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCardId() {
        return cardId;
    }

    public void setCardId(int cardId) {
        this.cardId = cardId;
    }

    public int getPresented() {
        return presented;
    }

    public void setPresented(int presented) {
        this.presented = presented;
    }

    public int getCorrect() {
        return correct;
    }

    public void setCorrect(int correct) {
        this.correct = correct;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }
}
