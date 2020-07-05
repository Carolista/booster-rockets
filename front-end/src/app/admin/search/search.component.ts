import { Component, OnInit } from '@angular/core';
import allFlashcards from '../../../assets/question-bank.json';
import { Flashcard } from 'src/app/flashcard';
import { User } from 'src/app/user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchType: string = "user";

  // FLASHCARD SEARCH
  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = [];
  
  keyword: string = "";
  selectedCategory: string = "";
  selectedTopic: string = "";
  selectedType: string = "";
  numberOfCards: number = allFlashcards.length;
  flashcardResults: Flashcard[] = [];

  letters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  allUsers: User[] = [new User("Caroline", "Jones","caroline@jones.com","",null,null,null,null),
                      new User("Fitzwilliam","Darcy","mrdarcy@derbyshire.com","",null,null,null,null),
                      new User("Bilbo","Baggins","bilbo@theshire.com","",null,null,null,null),
                      new User("Willy","Wonka","willy@wonkachocolates.com","",null,null,null,null),
                      new User("John Jacob","Jingleheimerschmidt","johnjacob@longlastnames.com","",null,null,null,null),
                      new User("William","Riker","commander.riker@federation.com","",null,null,null,null)];
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  numberOfUsers: number = this.allUsers.length;
  userResults: User[] = [];

  constructor() { }

  ngOnInit() {
    this.buildFlashcardSearchArrays();
    this.getFlashcardResults();
    this.getUserResults();
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
    allFlashcards.forEach(obj => {
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
  }

  flashcardSearchTermFound(term: string, card: Flashcard): boolean {
    term = term.toLowerCase();
    let category = card.category.toLowerCase();
    let topic = card.topic.toLowerCase();
    let query = card.query.toLowerCase();
    let choices = card.choices.toString().toLowerCase();
    if (category.indexOf(term) >=0
        || topic.indexOf(term) >= 0
        || query.indexOf(term) >= 0
        || choices.indexOf(term) >= 0) {
          return true;
        }
    return false;
  }

  getFlashcardResults() {

    // start with all possible questions in a new array
    this.flashcardResults = allFlashcards.slice(0);

    // filter results
    let i: number = 0;
    while (i < this.flashcardResults.length) {
      let card = this.flashcardResults[i];

      // narrow based on keyword
      if (this.keyword.length > 0 && !this.flashcardSearchTermFound(this.keyword,card)) {
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
      // otherwise it is kept in the array and i increases
      i++
    }

    console.log("Flashcard results ready.")
  }


  // USER SEARCH

  getUserResults() {

    // start with all possible users in a new array
    this.userResults = this.allUsers.slice(0);

    // filter results
    let i: number = 0;
    while (i < this.userResults.length) {
      let user = this.userResults[i];

      // narrow based on each field
      if (this.firstName.length > 0 && user.firstName.toLowerCase().indexOf(this.firstName.toLowerCase()) < 0) {
        this.userResults.splice(i,1);
        continue; // end loop and do not advance i due to splice
      }
      if (this.lastName.length > 0 && user.lastName.toLowerCase().indexOf(this.lastName.toLowerCase()) < 0) {
        this.userResults.splice(i,1);
        continue; 
      }        
      if (this.email.length > 0 && user.email.toLowerCase().indexOf(this.email.toLowerCase()) < 0) {
        this.userResults.splice(i,1);
        continue; 
      } 
      // otherwise it is kept in the array and i increases
      i++
    }

    console.log("User results ready.")
  }

}
