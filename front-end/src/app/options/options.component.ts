import { Component, OnInit } from '@angular/core';
import questionBank from '../../assets/question-bank.json';
import { Filters } from '../filters';
import { Question } from '../question';
import { Statistics } from '../statistics';
import { Settings } from '../settings';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  dataReady: boolean = false; // TODO: prevent page from being visible until this is true
  allCategories: string[] = [];
  allTopics: string[] = [];
  allTypes: string[] = [];
  cardsPerCategory: number[] = [];
  accuracyPerCategory: number[] = [];
  cardsPerTopic: number[] = [];
  accuracyPerTopic: number[] = [];

  // temporarily hard-coded
  filters: Filters = new Filters([],[],[]); // FIXME: pull from user

  // temporarily hard-code question objects in lieu of user array
  questions: Question[] = [ // FIXME: pull from user
    new Question(1, 3, 2),
    new Question(2, 4, 3),
    new Question(5, 6, 5),
    new Question(7, 4, 4),
    new Question(9, 2, 1)
  ]

  settings: Settings = new Settings(true); // FIXME: pull from user

  // temporarily hard-code stats into new object
  statistics: Statistics = new Statistics; // FIXME: pull from user

  constructor() { }

  ngOnInit() {
    this.getFilterOptions();
  }

  getFilterOptions() {
    questionBank.forEach(obj => {
      if (! this.allCategories.includes(obj.category)) {
        this.allCategories.push(obj.category);
      } 
      if (! this.allTopics.includes(obj.topic)) {
        this.allTopics.push(obj.topic);
      } 
      if (! this.allTypes.includes(obj.type)) {
        this.allTypes.push(obj.type);
      } 
    });
    this.allCategories.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Categories are: " + this.allCategories);
    this.allTypes.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Types are: " + this.allTypes);
    this.filters = new Filters(this.allCategories, this.allTopics, this.allTypes); // TODO: later this will come from user
    this.buildStatsArrays();
    this.dataReady = true; // TODO: implement or delete this
  }

  getStatsPerCategory(category: string): number[] {
    let presented = 0;
    let correct = 0;
    let accuracy = 0;
    for(let i=0; i < this.questions.length; i++) {
      if (this.getCategoryByCardId(this.questions[i].cardId) === category) {
        presented += this.questions[i].presented;
        correct += this.questions[i].correct;
      }
    }
    if (presented > 0) {
      accuracy = Math.round(correct/presented * 100);
    }
    return [presented, accuracy];
  }

  getStatsPerTopic(topic: string): number[] {
    let presented = 0;
    let correct = 0;
    let accuracy = 0;
    for(let i=0; i < this.questions.length; i++) {
      if (this.getTopicByCardId(this.questions[i].cardId) === topic) {
        presented += this.questions[i].presented;
        correct += this.questions[i].correct;
      }
    }
    if (presented > 0) {
      accuracy = Math.round(correct/presented * 100);
    }
    return [presented, accuracy];
  }

  getCategoryByCardId(cardId: number): string {
    let category: string;
    questionBank.forEach(obj => {
      if (obj.id === cardId) {
        category = obj.category;
      } 
    });
    return category;
  }

  getTopicByCardId(cardId: number): string {
    let topic: string;
    questionBank.forEach(obj => {
      if (obj.id === cardId) {
        topic = obj.topic;
      } 
    });
    return topic;
  }

  buildStatsArrays() {
    this.allCategories.forEach(category => {
      let statsPerCategory: number[] = this.getStatsPerCategory(category);
      this.cardsPerCategory.push(statsPerCategory[0]);
      this.accuracyPerCategory.push(statsPerCategory[1]);
    })
    this.allTopics.forEach(topic => {
      let statsPerTopic: number[] = this.getStatsPerTopic(topic);
      this.cardsPerTopic.push(statsPerTopic[0]);
      this.accuracyPerTopic.push(statsPerTopic[1]);
    })
  }

  updateCategories(category: string, checked: boolean) {
    let index: number = this.filters.categories.indexOf(category);
    if (!checked && index >= 0) {
      this.filters.categories.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.categories.push(category);
    }
  }

  updateTopics(topic: string, checked: boolean) {
    let index: number = this.filters.topics.indexOf(topic);
    if (!checked && index >= 0) {
      this.filters.topics.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.topics.push(topic);
    }
  }

  updateTypes(type: string, checked: boolean) {
    let index: number = this.filters.types.indexOf(type);
    if (!checked && index >= 0) {
      this.filters.types.splice(index,1);
    } else if (checked && index === -1) {
      this.filters.types.push(type);
    }
  }

  selectAll(checked: boolean) {
    for (let i=0; i < this.allCategories.length; i++) {
      this.updateCategories(this.allCategories[i],checked);
    }
    for (let j=0; j < this.allTopics.length; j++) {
      this.updateTopics(this.allTopics[j], checked);
    }
    for (let k=0; k < this.allTypes.length; k++) {
      this.updateTypes(this.allTypes[k], checked);
    }
  }

  countSelections(): number {
    let count: number = 0;
    questionBank.forEach(obj => {
      // TODO: count number of cards matching current criteria
    });
    return count;
  }

}
