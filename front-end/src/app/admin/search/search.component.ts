import { Component, OnInit } from '@angular/core';
import { Flashcard } from 'src/app/flashcard';
import { User } from 'src/app/user';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

  dataIsLoaded: boolean = false;
  searchType: string = "user"; // set default as either "user" or "flashcard"

  // FLASHCARD SEARCH
  flashcardsURL: string = "http://localhost:8080/api/flashcards"
  allFlashcards: Flashcard[];
  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = []; 
  keyword: string = "";
  selectedCategory: string = "";
  selectedTopic: string = "";
  selectedType: string = "";
  numberOfCards: number;
  flashcardResults: Flashcard[] = [];
  letters: string = "ABCDE"; // there are never more than 5 choices

  // USER SEARCH
  userURL: string = "http://localhost:8080/api/user"
  allUsers: User[];
  userID: number = 0;
  userName: string = "";
  numberOfUsers: number;
  userResults: User[] = [];

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login'])
    } 
    this.loadUsers();
  }

// LOAD USERS FROM DATABASE

loadUsers() {
  fetch(this.userURL, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Authorization': 'Bearer ' + this.tokenStorageService.getToken()
    }
  }).then(function(response: any) {
    response.json().then(function(json) {
      let users: User[] = [];
      json.forEach(obj => {
        let user = new User(obj.firstName, obj.lastName, obj.email, obj.password);
        user.id = obj.id;
        user.filters = obj.filters;
        user.questions = obj.questions;
        user.settings = obj.settings;
        user.statistics = obj.statistics;
        users.push(user);
      });
      this.allUsers = users;
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
        this.buildFlashcardSearchArrays();
      }.bind(this));
    }.bind(this));
  } 

  // FLASHCARD SEARCH

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

  buildFlashcardSearchArrays() {
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

    this.getFlashcardResults(); // to return all the first time
    this.getUserResults(); // to return all the first time

    this.dataIsLoaded = true;

    console.log("Flashcard arrays built for categories, topics, and types.")
  }

  flashcardKeywordFound(keyword: string, card: Flashcard): boolean {
    keyword = keyword.toLowerCase();
    let category = card.category.toLowerCase();
    let topic = card.topic.toLowerCase();
    let query = card.query.toLowerCase();
    let choices = [card.answer, card.choiceB, card.choiceC, card.choiceD, card.choiceE].toString().toLowerCase();
    if (category.indexOf(keyword) >= 0
      || topic.indexOf(keyword) >= 0
      || query.indexOf(keyword) >= 0
      || choices.indexOf(keyword) >= 0) {
        return true;
      }
    return false;
  }

  getFlashcardResults() {

    // start with all possible questions in a new array
    this.flashcardResults = this.allFlashcards.slice(0);

    // filter results
    let i: number = 0;
    while (i < this.flashcardResults.length) {
      let card = this.flashcardResults[i];

      // narrow based on keyword
      if (this.keyword.length > 0 && !this.flashcardKeywordFound(this.keyword,card)) {
        this.flashcardResults.splice(i,1);
        continue; // end loop and do not advance i due to splice
      }

      // narrow based on dropdown options
      if (this.selectedCategory !== "") {
        if (this.selectedCategory !== card.category) {
          this.flashcardResults.splice(i,1);
          continue; 
        }        
      }
      if (this.selectedTopic !== "") {
        if (this.selectedTopic !== card.topic) {
          this.flashcardResults.splice(i,1);
          continue;
        }        
      }
      if (this.selectedType !== "") {
        if (this.selectedType !== card.type) {
          this.flashcardResults.splice(i,1);
          continue;
        }        
      }
      // otherwise this card is kept in the array and i increases
      i++
    }
  }


  // USER SEARCH

  getUserByID() {
    this.userName = ""; // clear name/email lookup field in form
    if (this.userID === null) { 
      this.userResults = this.allUsers.slice(0); // return all records
      return;
    }
    this.userResults = [];
    let user: User;
    for (let i=0; i < this.allUsers.length; i++) {
      user = this.allUsers[i]
      if (user.id === this.userID) {
        console.log("User number " + this.userID + " found");
        this.userResults.push(user);
        return;
      }
    }
    console.log("User number " + this.userID + " not found");
    return;
  }

  getUserResults() {
    this.userID = null; // clear ID lookup field in form

    // start with all possible users in a new array
    this.userResults = this.allUsers.slice(0);

    // filter results
    let i: number = 0;
    while (i < this.userResults.length) {
      let user = this.userResults[i];

      // narrow based on each field
      if ((user.firstName + user.lastName + user.email).toLowerCase().indexOf(this.userName.toLowerCase()) < 0) {
        this.userResults.splice(i,1);
        continue; 
      } 
      // otherwise it is kept in the array and i increases
      i++
    }

    // TODO: add dropdown selection so admin can choose how to sort results - ID, first name, or last name
    // TODO: maybe in the future could also sort by person with most cards presented or whatever
    
    this.userResults.sort((a,b) => (a.lastName > b.lastName) ? 1 : -1);

    console.log("User results updated.")
  }

}
