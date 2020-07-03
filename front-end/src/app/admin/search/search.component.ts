import { Component, OnInit } from '@angular/core';
import questionBank from '../../../assets/question-bank.json';
import { Flashcard } from 'src/app/flashcard';
import { User } from 'src/app/user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchType: string = "flashcard";

  flashcardResults: Flashcard[] = [];
  userResults: User[] = [];


  constructor() { }

  ngOnInit() {
  }

  // buildFlashcardResults() {

  //   // build flashcard set for this session from question bank
  //   this.flashcardResults = [];
  //   questionBank.forEach(obj => {
  //     let card = new Flashcard(obj.category, obj.topic, obj.type, obj.query, obj.choices, obj.answer);
  //     // add card to deck only if it fits user's criteria
  //     if (this.filters.categories.includes(card.category) && this.filters.types.includes(card.type)) {
  //       if (card.type === "Multiple Choice") { // TODO: add other types in future as needed
  //         this.shuffle(card.choices);
  //       }
  //       this.flashcards.push(card);
  //     }      
  //   });

  //   // TODO: if user is given choice to sort by category:
  //   // this.flashcards.sort((a, b) => (a.category > b.category) ? 1 : -1);

  //   this.shuffle(this.flashcards);
  //   this.currentCard = this.flashcards[this.currentIndex];
  //   this.setCurrentQuestion();
  //   console.log("Flashcard deck built.")
  // }

}
