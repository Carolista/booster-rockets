import { Component, OnInit } from '@angular/core';
import * as questionBank from '../../assets/question-bank.json';
import { Flashcard } from '../flashcard';
import { Question } from '../question';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css']
})

export class FlashcardComponent implements OnInit {

  flashcards: Flashcard[];
  currentCard: Flashcard; // ngModel
  
  constructor() { 
  }

  ngOnInit() {
    this.buildFlashcardSet();
  }

  // create randomized list of questions based on user's criteria
  buildFlashcardSet() {


    // use criteria from user to build flashcard set for this session
    this.flashcards = questionBank; // temporarily set to all for testing
    // TODO: look at satellite example for all vs. subset
    // reference helper randomize function
    this.currentCard = questionBank[0];
  }

  // TODO: function to check user response against answer
  // TODO: function to save/update question for user stats
  

}
