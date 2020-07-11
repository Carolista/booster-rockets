import { Component, OnInit } from '@angular/core';
import { Flashcard } from 'src/app/flashcard';
import { User } from 'src/app/user';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataIsLoaded: boolean = false;

  flashcardsURL: string = "http://localhost:8080/api/flashcards"
  allFlashcards: Flashcard[];
  numberOfCards: number;

  userURL: string = "http://localhost:8080/api/user";
  allUsers: User[];
  numberOfUsers: number;

  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = [];

  constructor(private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    this.loadUsers();
    // this.loadFlashcards(); // temporary while fixing user loading - delete after
  }

  // LOAD USERS FROM DATABASE

  loadUsers() {
    fetch(this.userURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
      },
    }).then(function(response: any) {
      response.json().then(function(json) {
        let userList: User[] = [];
        json.forEach(obj => {
          let user = new User(obj.firstName, obj.lastName, obj.email, obj.password);
          user.id = obj.id;
          user.filters = obj.filters;
          user.questions = obj.questions;
          user.settings = obj.settings;
          user.statistics = obj.statistics;
          userList.push(user);
        });
        this.allUsers = userList;
        this.numberOfUsers = this.allUsers.length;
        this.loadFlashcards();
      }.bind(this));
    }.bind(this));
  }

  // LOAD FLASHCARDS FROM DATABASE

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
        this.numberOfCards = this.allFlashcards.length;
        this.buildSectionArrays();
      }.bind(this));
    }.bind(this));
  } 

  buildSectionArrays() {
    let index: number;
    this.allFlashcards.forEach(obj => {
      index = this.findCategory(obj.category);
      if (index === -1) {
        this.allCategories.push(obj.category);
      }
      index = this.findTopic(obj.topic);
      if (index === -1) {
        this.allTopics.push(obj.topic);
      } 
      index = this.findType(obj.type);
      if (index === -1) {
        this.allTypes.push(obj.type);
      } 
    });
    this.allCategories.sort((a, b) => (a > b) ? 1 : -1);
    this.allTopics.sort((a, b) => (a > b) ? 1 : -1);
    this.allTypes.sort((a, b) => (a > b) ? 1 : -1);

    this.dataIsLoaded = true;
  }

  findCategory(category: string): number {
    for (let i=0; i < this.allCategories.length; i++) {
      if (this.allCategories[i] === category) {
        return i;
      }
    }
    return -1;
  }

  findTopic(topic: string): number {
    for (let i=0; i < this.allTopics.length; i++) {
      if (this.allTopics[i] === topic) {
        return i;
      }
    }
    return -1;
  }

  findType(type: string): number {
    for (let i=0; i < this.allTypes.length; i++) {
      if (this.allTypes[i] === type) {
        return i;
      }
    }
    return -1;
  }

  

}
