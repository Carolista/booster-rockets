import { Component, OnInit } from '@angular/core';
import { Flashcard } from '../flashcard';
import { Question } from '../question';
import { Filters } from '../filters';
import { Statistics } from '../statistics';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.css']
})

export class DeckComponent implements OnInit {

  dataIsLoaded: boolean = false;
  flashcardsURL: string = "http://localhost:8080/api/flashcards"
  allFlashcards: Flashcard[];

  deck: Flashcard[];
  currentCard: Flashcard;
  currentQuestion: Question;
  currentIndex: number = 0;
  currentChoices: string[] = [];
  currentResponse: string;
  answered: boolean = false;
  correct: boolean = true;

  // temporarily hard-code Filters object to test function in buildFlashcardSet
  filters: Filters = new Filters(["JavaScript", "Angular", "Thymeleaf", "SQL"], ["Queries", "Arrays", "General"], ["Multiple Choice","True/False"]);

  // temporarily hard-code Question array to test statistics calculations
  questions: Question[] = [
    new Question(1, 3, 2),
    new Question(2, 4, 3),
    new Question(5, 6, 5),
    new Question(7, 4, 4),
    new Question(9, 2, 1)
  ]

  // temporarily hard-code Statistics object to test statistics calculations
  statistics: Statistics = new Statistics();

  constructor(private tokenStorageService: TokenStorageService) { 
  }

  ngOnInit() {
    this.loadFlashcards();
  }

  loadFlashcards() {
    fetch(this.flashcardsURL, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      }
    }).then(function(response: any) {
      response.json().then(function(json) {
        let questionBank: Flashcard[] = [];
        json.forEach(obj => {
          let flashcard = new Flashcard(obj.category, obj.topic, obj.type, obj.query, obj.answer, obj.choiceB, obj.choiceC, obj.choiceD, obj.choiceE);
          flashcard.id = obj.id;
          questionBank.push(flashcard);
        });
        this.allFlashcards = questionBank;
        this.buildFlashcardSet();
      }.bind(this));
    }.bind(this));
  }  

  // create randomized list of questions based on user's criteria
  buildFlashcardSet() {

    // build flashcard set for this session from all Flashcards
    this.deck = [];
    this.allFlashcards.forEach(obj => {
      let card = new Flashcard(obj.category, obj.topic, obj.type, obj.query, obj.answer, obj.choiceB, obj.choiceC, obj.choiceD, obj.choiceE);
      // add card to deck only if it fits user's criteria
      if (this.filters.categories.includes(card.category) && this.filters.topics.includes(card.topic) && this.filters.types.includes(card.type)) {
        this.deck.push(card);
        console.log("added question to deck: " + card.query);
      }      
    });

    // TODO: if user is given choice to sort by category:
    // this.deck.sort((a, b) => (a.category > b.category) ? 1 : -1);

    this.shuffle(this.deck);
    this.currentCard = this.deck[this.currentIndex];
    this.setCurrentChoices();
    this.setCurrentQuestion();
    console.log("Flashcard deck built.")
  }

  checkAnswer() {
    this.answered = true;
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      let question = new Question(this.currentCard.id, 0, 0);
      this.questions.push(question);
      index = this.questions.length - 1;
    }
    this.questions[index].presented++;
    this.statistics.presented++;
    if (this.currentResponse === this.currentCard.answer) {
      this.questions[index].correct++;
      this.statistics.correct++;
      this.statistics.currentStreak++;
      if (this.statistics.currentStreak > this.statistics.longestStreak) {
        this.statistics.longestStreak = this.statistics.currentStreak;
      }
      this.correct = true;
    } else {
      this.correct = false;
    }
    // console.log(this.questions[index]);
  }

  setCurrentQuestion() {
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      this.currentQuestion = new Question(this.currentCard.id, 0, 0); 
    } else {
      this.currentQuestion = this.questions[index];
    }
    this.dataIsLoaded = true;
  }

  setCurrentChoices() {
    if (this.currentCard.type === "True/False") {
      this.currentChoices = ["True", "False"];
    } else {
      this.currentChoices = [this.currentCard.answer,this.currentCard.choiceB];
      if (this.currentCard.choiceC !== "") {
        this.currentChoices.push(this.currentCard.choiceC);
      }
      if (this.currentCard.choiceD !== "") {
        this.currentChoices.push(this.currentCard.choiceD);
      }
      if (this.currentCard.choiceE !== "") {
        this.currentChoices.push(this.currentCard.choiceE);
      }
      this.shuffle(this.currentChoices);
    } 
  }

  getSuccessRate(): number {
    return Math.round((this.currentQuestion.correct / this.currentQuestion.presented) * 100);
  }

  getNextCard() {
    if (this.currentIndex === this.deck.length - 1) {
      // TODO: need to ask if they want to start again
      this.shuffle(this.deck);
      this.currentIndex = 0; // this works to return to beginning and loop through in existing order
    } else {
      this.currentIndex++;
    }
    this.currentCard = this.deck[this.currentIndex];
    this.setCurrentQuestion();
    this.setCurrentChoices();
    // TODO: eventually use this to rotate graphics for changing deck

    this.answered = false;
  }

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
