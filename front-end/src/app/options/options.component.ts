import { Component, OnInit } from '@angular/core';
import questionBank from '../../assets/question-bank.json';
import { Filters } from '../filters';
import { Question } from '../question';
import { Statistics } from '../statistics';
import { Flashcard } from '../flashcard';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  dataReady: boolean = false; // TODO: prevent page from being visible until this is true
  categories: string[] = [];
  topics: string[] = [];
  types: string[] = [];
  cardsPerCategory: number[] = [];
  accuracyPerCategory: number[] = [];
  cardsPerTopic: number[] = [];
  accuracyPerTopic: number[] = [];
  filters: Filters;

  // TODO: need way to store selections and carry through to deck component

  // temporarily hard-code question objects in lieu of user array
  questions: Question[] = [
    new Question(123, 1, 3, 2),
    new Question(145, 2, 4, 3),
    new Question(164, 5, 6, 5),
    new Question(198, 7, 4, 4),
    new Question(210, 9, 2, 1)
  ]

  // temporarily hard-code stats into new object
  statistics: Statistics = new Statistics; // FIXME: pull from user once persistence is in place


  constructor() { }

  ngOnInit() {
    this.getFilterOptions();
  }

  getFilterOptions() {
    questionBank.forEach(obj => {
      if (! this.categories.includes(obj.category)) {
        this.categories.push(obj.category);
      } 
      if (! this.topics.includes(obj.topic)) {
        this.topics.push(obj.topic);
      } 
      if (! this.types.includes(obj.type)) {
        this.types.push(obj.type);
      } 
      // TODO: types (and topics) will need to be built dynamically depending on which categories are chosen
    });
    this.categories.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Categories are: " + this.categories);
    this.types.sort((a, b) => (a > b) ? 1 : -1);
    console.log("Types are: " + this.types);
    this.filters = new Filters(null, this.categories, this.topics, this.types); // TODO: later this will come from user
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
    this.categories.forEach(category => {
      let statsPerCategory: number[] = this.getStatsPerCategory(category);
      this.cardsPerCategory.push(statsPerCategory[0]);
      this.accuracyPerCategory.push(statsPerCategory[1]);
    })
    this.topics.forEach(topic => {
      let statsPerTopic: number[] = this.getStatsPerTopic(topic);
      this.cardsPerTopic.push(statsPerTopic[0]);
      this.accuracyPerTopic.push(statsPerTopic[1]);
    })
  }

  // TODO: function to select or deselect all checkboxes

  // TODO: function to collect categories
  // TODO: function to collect topics
  // TODO: function to collect question types

  countSelections(): number {
    let count: number = 0;
    questionBank.forEach(obj => {
      // TODO: count number of cards matching current criteria
    });
    return count;
  }

}
