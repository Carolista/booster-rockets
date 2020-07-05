package com.kaleidoscope314.boosterrockets.models;

import javax.persistence.Entity;

@Entity
public class Statistics extends AbstractEntity {

    private int presented = 0;
    private int correct = 0;
    private double accuracy = 0;

    private int currentStreak = 0;
    private int longestStreak = 0;

    public Statistics() {}

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

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

}
