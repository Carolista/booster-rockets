import { Component, OnInit } from '@angular/core';
import questionBank from '../../assets/question-bank.json';
import { Flashcard } from '../flashcard';
import { Question } from '../question';

@Component({
  selector: 'app-flashcard',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements OnInit {

  flashcards: Flashcard[];
  currentCard: Flashcard;
  currentIndex: number = 0;
  answered: boolean = false;
  correct: boolean = true;

  constructor() { 
  }

  ngOnInit() {
    this.buildFlashcardSet();
  }

  // create randomized list of questions based on user's criteria
  buildFlashcardSet() {

    // build flashcard set for this session from question bank
    this.flashcards = [];
    // TODO: use criteria instead of adding all
    questionBank.forEach(obj => {
      let card = new Flashcard(obj.id, obj.category, obj.type, obj.query, obj.choices, obj.answer);
      if (card.type != "True/False") {
        this.shuffle(card.choices);
      }
      this.flashcards.push(card);
    });

    // if sorting by category:
    // this.flashcards.sort((a, b) => (a.category > b.category) ? 1 : -1);

    this.shuffle(this.flashcards);
    this.currentCard = this.flashcards[this.currentIndex];
  }

  checkAnswer(answer: string) {
    this.answered = true;
    if (answer == this.currentCard.answer) {
      this.correct = true;
    } else {
      this.correct = false;
    }
  }

  getNextCard() {
    this.currentCard.used = true;
    if (this.currentIndex == this.flashcards.length - 1) {
      // TODO: need to ask if they want to start again and then maybe reshuffle?
      this.currentIndex = 0; // this works to return to beginning and loop through in existing order
    } else {
      this.currentIndex++;
    }
    this.currentCard = this.flashcards[this.currentIndex];
    // TODO: eventually use this to rotate graphics for changing flashcards

    this.answered = false;
  }

  // TODO: function to save/update question for user stats

  shuffle(array: any[]): any[] {
    let currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) { 
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
