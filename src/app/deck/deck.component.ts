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
  answered: boolean = false;
  correct: boolean = true;

  constructor() { 
  }

  ngOnInit() {
    this.buildFlashcardSet();
  }

  // create randomized list of questions based on user's criteria
  buildFlashcardSet() {

    // use criteria from user to build flashcard set for this session
    this.flashcards = [];
    questionBank.forEach(obj => {
      let card = new Flashcard(obj.id, obj.category, obj.type, obj.query, obj.choices, obj.answer);
      this.flashcards.push(card);
    });
    this.flashcards.sort((a, b) => (a.category > b.category) ? 1 : -1);
    // TODO: look at satellite example for all vs. subset
    // reference helper randomize function
    this.currentCard = questionBank[2];
  }

  // TODO: function to save/update question for user stats
  
  checkAnswer(answer: string) {
    this.answered = true;
    if (answer == this.currentCard.answer) {
      this.correct = true;
    } else {
      this.correct = false;
    }
  }

  getNextCard() {
    this.answered = false;
    this.currentCard = questionBank[3]; // FIXME: need relative reference
    // TODO: eventually use this to rotate graphics for changing flashcards
  }

}
