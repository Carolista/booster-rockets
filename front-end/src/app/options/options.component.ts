import { Component, OnInit } from '@angular/core';
import { Flashcard } from '../flashcard';
import { Filters } from '../filters';
import { Question } from '../question';
import { Statistics } from '../statistics';
import { Settings } from '../settings';
import { Selection } from '../selection'
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { User } from '../user';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent implements OnInit {

  dataIsLoaded: boolean = false;
  flashcardsURL: string = "http://localhost:8080/api/flashcards";
  allFlashcards: Flashcard[] = [];
  userURL: string = "http://localhost:8080/api/user/"; // needs last slash for concatenation with userID
  roles: string[];
  userID: number;

  filters: Filters;; 
  questions: Question[];
  settings: Settings;
  statistics: Statistics;

  // ngModels
  includeStats: Selection = new Selection("Include Statistics", true);
  allCategories: Selection[] = [];
  allTopics: Selection[] = [];
  allTypes: Selection[] = [];
  selectAllCategoryBoxes: Selection = new Selection("Select All", true);
  selectAllTopicBoxes: Selection = new Selection("Select All", true);
  selectAllTypeBoxes: Selection = new Selection("Select All", true);

  cardsPerCategory: number[] = [];
  viewsPerCategory: number[] = [];
  accuracyPerCategory: number[] = [];
  cardsPerTopic: number[] = [];
  viewsPerTopic: number[] = [];
  accuracyPerTopic: number[] = [];

  cardsInDeck: number = 0;
  
  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorageService.getToken()) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      // this.showAdminBoard = this.roles.includes('ROLE_ADMIN'); // TODO: implement?
      this.userID = user.id;
      this.loadUser();
    } else {
      this.router.navigate(['/login'])
    }   
  }

  // GET USER 

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
        this.filters === null ? new Filters([],[],[]) : json.filters;
        this.questions === null ? [] : json.questions;
        this.settings === null ? new Settings(true) : json.settings;
        this.statistics === null ? new Statistics() : json.statistics;
        this.loadFlashcards();
      }.bind(this));
    }.bind(this));
  }

  // ** PULL IN ALL FLASHCARDS FROM DATABASE QUESTION BANK ** //

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
        this.buildSelectionArrays();
        
      }.bind(this));
    }.bind(this));
  }  


// ** GET CATEGORIES, TOPICS, & TYPES FROM QUESTION BANK ** //

  buildSelectionArrays() {
    let index: number;
    let selected: boolean;
    this.allFlashcards.forEach(obj => {
      index = this.findCategory(obj.category);
      if (index === -1) {
        selected = (this.filters.categories.indexOf(obj.category) >= 0);
        this.allCategories.push(new Selection(obj.category, selected));
      }
      index = this.findTopic(obj.topic);
      if (index === -1) {
        selected = (this.filters.topics.indexOf(obj.topic) >= 0);
        this.allTopics.push(new Selection(obj.topic, selected));
      } 
      index = this.findType(obj.type);
      if (index === -1) {
        selected = (this.filters.types.indexOf(obj.type) >= 0);
        this.allTypes.push(new Selection(obj.type, selected));
      } 
    });

    this.allCategories.sort((a, b) => (a.item > b.item) ? 1 : -1);
    this.allTopics.sort((a, b) => (a.item > b.item) ? 1 : -1);
    this.allTypes.sort((a, b) => (a.item > b.item) ? 1 : -1);

    this.updateCategories;
    this.updateTopics;
    this.updateTypes;
    this.countSelections();

    this.buildStatsArrays();
  }

  findCategory(category: string): number {
    for (let i=0; i < this.allCategories.length; i++) {
      if (this.allCategories[i].item === category) {
        return i;
      }
    }
    return -1;
  }

  
  findTopic(topic: string): number {
    for (let i=0; i < this.allTopics.length; i++) {
      if (this.allTopics[i].item === topic) {
        return i;
      }
    }
    return -1;
  }

  findType(type: string): number {
    for (let i=0; i < this.allTypes.length; i++) {
      if (this.allTypes[i].item === type) {
        return i;
      }
    }
    return -1;
  }


  // ** CREATE STATS FOR EACH CATEGORY AND TOPIC ** //

  buildStatsArrays() {
    this.allCategories.forEach(obj => {
      let statsPerCategory: number[] = this.getStatsPerCategory(obj.item);
      this.cardsPerCategory.push(statsPerCategory[0]);
      this.viewsPerCategory.push(statsPerCategory[1]);
      this.accuracyPerCategory.push(statsPerCategory[2]);
    })
    this.allTopics.forEach(obj => {
      let statsPerTopic: number[] = this.getStatsPerTopic(obj.item);
      this.cardsPerTopic.push(statsPerTopic[0]);
      this.viewsPerTopic.push(statsPerTopic[1]);
      this.accuracyPerTopic.push(statsPerTopic[2]);
    })
    this.dataIsLoaded = true;
  }

  getStatsPerCategory(category: string): number[] {
    let count = 0;
    let presented = 0;
    let correct = 0;
    let accuracy = 0;
    // from full deck of available cards
    this.allFlashcards.forEach(obj => {
      if (obj.category === category) {
        count++
      }
    });
    // from user's history
    for(let i=0; i < this.questions.length; i++) {
      if (this.getCategoryByCardId(this.questions[i].cardId) === category) {
        presented += this.questions[i].presented;
        correct += this.questions[i].correct;
      }
    }
    if (presented > 0) {
      accuracy = Math.round(correct/presented * 100);
    }
    return [count, presented, accuracy];
  }

  getStatsPerTopic(topic: string): number[] {
    let count = 0;
    let presented = 0;
    let correct = 0;
    let accuracy = 0;
    // from full deck of available cards
    this.allFlashcards.forEach(obj => {
      if (obj.topic === topic) {
        count++
      }
    });
    // from user's history
    for(let i=0; i < this.questions.length; i++) {
      if (this.getTopicByCardId(this.questions[i].cardId) === topic) {
        presented += this.questions[i].presented;
        correct += this.questions[i].correct;
      }
    }
    if (presented > 0) {
      accuracy = Math.round(correct/presented * 100);
    }
    return [count, presented, accuracy];
  }

  getCategoryByCardId(cardId: number): string {
    let category: string;
    this.allFlashcards.forEach(obj => {
      if (obj.id === cardId) {
        category = obj.category;
      } 
    });
    return category;
  }

  getTopicByCardId(cardId: number): string {
    let topic: string;
    this.allFlashcards.forEach(obj => {
      if (obj.id === cardId) {
        topic = obj.topic;
      } 
    });
    return topic;
  }


  // ** SAVE SELECTIONS & UPDATE DECK COUNT ** //

  updateCategories(c: number) {
    let category = this.allCategories[c].item;
    let checked = this.allCategories[c].checked;
    let index: number = this.filters.categories.indexOf(category);
    if (!checked && index >= 0) {
      this.filters.categories.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.categories.push(category);
    }
    if (this.filters.categories.length === this.allCategories.length) {
      this.selectAllCategoryBoxes.checked = true;
    } else {
      this.selectAllCategoryBoxes.checked = false;
    }
    this.countSelections();
  }

  updateTopics(p: number) {
    let topic = this.allTopics[p].item;
    let checked = this.allTopics[p].checked;
    let index: number = this.filters.topics.indexOf(topic);
    if (!checked && index >= 0) {
      this.filters.topics.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.topics.push(topic);
    }
    if (this.filters.topics.length === this.allTopics.length) {
      this.selectAllTopicBoxes.checked = true;
    } else {
      this.selectAllTopicBoxes.checked = false;
    }
    this.countSelections();
  }

  updateTypes(t: number) {
    let type = this.allTypes[t].item;
    let checked = this.allTypes[t].checked;
    let index: number = this.filters.types.indexOf(type);
    if (!checked && index >= 0) {
      this.filters.types.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.types.push(type);
    }
    if (this.filters.types.length === this.allTypes.length) {
      this.selectAllTypeBoxes.checked = true;
    } else {
      this.selectAllTypeBoxes.checked = false;
    }
    this.countSelections();
  }

  // select or deselect all categories and topics on page
  selectAllCategories(isChecked: boolean) {
    for (let i=0; i < this.allCategories.length; i++) {
      this.allCategories[i].checked = isChecked;
      this.updateCategories(i); 
    }
  }

  selectAllTopics(isChecked: boolean) {
    for (let j=0; j < this.allTopics.length; j++) {
      this.allTopics[j].checked = isChecked;
      this.updateTopics(j);
    }
  }

  selectAllTypes(isChecked: boolean) {
    for (let k=0; k < this.allTypes.length; k++) {
      this.allTypes[k].checked = isChecked;
      this.updateTypes(k);
    }
  }

  countSelections() {
    let count: number = 0;
    this.allFlashcards.forEach(obj => {
      if (this.filters.categories.includes(obj.category) 
          && this.filters.topics.includes(obj.topic) 
          && this.filters.types.includes(obj.type)) {
        count++
      }
    });
    this.cardsInDeck = count;
  }

  // TODO: MAKE SURE ALL SELECTIONS ARE SAVED WITH USER UPON FORM SUBMISSION

}
