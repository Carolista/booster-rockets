import { Component, OnInit } from '@angular/core';
import questionBank from '../../assets/question-bank.json';
import { Flashcard } from '../flashcard';
import { Question } from '../question';
import { Filters } from '../filters';

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

  // temporarily hard-code Filters object to test function in buildFlashcardSet
  filters: Filters = new Filters(null, ["JavaScript", "Angular", "Thymeleaf", "SQL"], ["Multiple Choice","True/False"]);

  // temporarily hard-code Question array to test statistics calculations
  questions: Question[] = [
    new Question(123, 1, 3, 2),
    new Question(145, 2, 4, 3),
    new Question(164, 5, 6, 5)
  ]

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
      // add card to deck only if it fits user's criteria
      if (this.filters.categories.includes(card.category) && this.filters.types.includes(card.type)) {
        if (card.type == "Multiple Choice") { // TODO: add other types in future as needed
          this.shuffle(card.choices);
        }
        this.flashcards.push(card);
      }      
    });

    // if sorting by category:
    // this.flashcards.sort((a, b) => (a.category > b.category) ? 1 : -1);

    this.shuffle(this.flashcards);
    this.currentCard = this.flashcards[this.currentIndex];
  }

  checkAnswer(answer: string) {
    this.answered = true;
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      let question = new Question(null, this.currentCard.id, 0, 0);
      this.questions.push(question);
      index = this.questions.length - 1;
    }
    this.questions[index].presented++;
    if (answer === this.currentCard.answer) {
      this.questions[index].correct++;
      this.correct = true;
    } else {
      this.correct = false;
    }
    console.log(this.questions[index]);
  }

  getNextCard() {
    if (this.currentIndex === this.flashcards.length - 1) {
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

  // TODO: send updates to back end with each answer in case user exits page/browser mid-session


  findQuestionByCardId(cardId: number): number {
    let question: Question;
    for (let i = 0; i < this.questions.length; i++) {
      question = this.questions[i];
      if (question.cardId === cardId) {
        return i;
      }
    }
    return -1;
  }

  shuffle(array: any[]): any[] {
    let current = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== current) { 
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * current);
      current -= 1;
      // And swap it with the current element.
      temporaryValue = array[current];
      array[current] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

}
