import { Component, OnInit } from '@angular/core';
import { Flashcard } from '../flashcard';
import { Question } from '../question';
import { Filters } from '../filters';
import { Statistics } from '../statistics';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Settings } from '../settings';

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

  userURL: string = "http://localhost:8080/api/user/";
  user: User;
  userID: number;
  roles: string[];

  filters: Filters;
  questions: Question[];
  settings: Settings;
  statistics: Statistics;

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorageService.getToken()) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.userID = user.id;
      this.loadUser();
      console.log("Data for user " + user.id + " loaded from database.")
    } else {
      this.router.navigate(['/login'])
    } 
  }

  loadUser() {
    fetch(this.userURL + this.userID, {method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      },
    }).then(function(response) {
      response.json().then(function(json) {
        this.user = new User(json.firstName, json.lastName, json.email, json.password);
        this.user.id = json.id;
        this.filters = (json.filters === null ? new Filters([],[],[]) : json.filters);
        this.questions = (json.questions === null ? [] : json.questions);
        this.settings = (json.settings === null ? new Settings(true) : json.settings);
        this.statistics = (json.statistics === null ? new Statistics() : json.statistics);
        this.loadFlashcards();
        console.log("All flashcards loaded from database.")
      }.bind(this));
    }.bind(this));
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
      card.id = obj.id;
      // add card to deck only if it fits user's criteria
      if (this.filters.categories.includes(card.category) && this.filters.topics.includes(card.topic) && this.filters.types.includes(card.type)) {
        this.deck.push(card);
      }      
    });

    // TODO: if user is given choice to sort by category:
    // this.deck.sort((a, b) => (a.category > b.category) ? 1 : -1);

    // otherwise shuffle to randomize order
    this.shuffle(this.deck);
    console.log("Flashcard deck built.")
    this.currentCard = this.deck[this.currentIndex];
    console.log("The first flashcard is card with id " + this.currentCard.id);
    this.setCurrentChoices();
    this.setCurrentQuestion();
    this.dataIsLoaded = true;
  }

  setCurrentQuestion() {
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      this.currentQuestion = new Question(this.currentCard.id, 0, 0, false); 
    } else {
      this.currentQuestion = this.questions[index];
    }
    console.log("Current question object set to track statistics for card " + this.currentCard.id);
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

  checkAnswer() {
    this.answered = true;

    // add question to list of answered questions if not already there
    let index = this.findQuestionByCardId(this.currentCard.id);
    if (index === -1) {
      console.log("question " + this.currentCard.id + " not found in user history")
      this.questions.push(this.currentQuestion);
      console.log(this.questions);
      index = this.questions.length - 1; // now that it's been added
    }

    // update per-question statistics and user's global statistics
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

    // send updated data to back end and store in database 
    this.saveData();
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
    // TODO: eventually use this to rotate graphics for changing deck?

    this.answered = false;
  }

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

  getSuccessRate(): number {
    return Math.round((this.currentQuestion.correct / this.currentQuestion.presented) * 100);
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

  saveData() {

    this.user.filters = this.filters;
    console.log(this.questions);
    this.user.questions = this.questions;
    console.log("Questions saved to user object.");

    // FIXME: Questions are still not saving in database, even though they are being sent. Check back end
    // structure for itemDetails in construction estimator as they relate to project, as an example

    console.log(this.user.questions);
    this.user.settings = this.settings;
    this.user.statistics = this.statistics;

    // save to database since there is no final 'submit' button and user could leave page at any time
    fetch(this.userURL + this.user.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      },
      body: JSON.stringify(this.user),
    }).then(function (response) {
    }.bind(this)).then(function (data) {
      console.log('Success:', data);
    }).catch(function (error) {
      console.error('Error:', error);
    });

  }

}
