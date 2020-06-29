import { Component, OnInit } from '@angular/core';
import allFlashcards from '../../assets/question-bank.json';
import { Filters } from '../filters';
import { Question } from '../question';
import { Statistics } from '../statistics';
import { Settings } from '../settings';
import { Selection } from '../selection';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent implements OnInit {

  // ngModels
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
 
  // TEMPORARY PROPERTIES OF USER UNTIL BACK END IS CONNECTED FIXME: pull from user
  filters: Filters = new Filters([],[],["Multiple Choice", "True/False"]); 
  questions: Question[] = [ 
    new Question(1, 3, 2),
    new Question(2, 4, 3),
    new Question(5, 6, 5),
    new Question(7, 4, 4),
    new Question(9, 2, 1)
  ]
  settings: Settings = new Settings(true);
  statistics: Statistics = new Statistics;

  constructor() { }

  ngOnInit() {
    this.buildSelectionArrays();
    this.buildStatsArrays();
  }

  buildSelectionArrays() { // FIXME: this will need to be updated once pulling from user
    let index: number;
    allFlashcards.forEach(obj => {
      index = this.findCategory(obj.category);
      if (index === -1) {
        this.allCategories.push(new Selection(obj.category, true));
        this.filters.categories.push(obj.category); // FIXME: temporary backfill
      }
      index = this.findTopic(obj.topic);
      if (index === -1) {
        this.allTopics.push(new Selection(obj.topic, true));
        this.filters.topics.push(obj.topic); // FIXME: temporary backfill
      } 
      index = this.findType(obj.type);
      if (index === -1) {
        this.allTypes.push(new Selection(obj.type, true));
      } 
    });
    this.allCategories.sort((a, b) => (a > b) ? 1 : -1);
    this.allTopics.sort((a, b) => (a > b) ? 1 : -1);
    this.allTypes.sort((a, b) => (a > b) ? 1 : -1);

    this.updateCategories;
    this.updateTopics;
    this.updateTypes;
    this.countSelections();
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

  getStatsPerCategory(category: string): number[] {
    let count = 0;
    let presented = 0;
    let correct = 0;
    let accuracy = 0;
    // from full deck of available cards
    allFlashcards.forEach(obj => {
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
      allFlashcards.forEach(obj => {
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
    allFlashcards.forEach(obj => {
      if (obj.id === cardId) {
        category = obj.category;
      } 
    });
    return category;
  }

  getTopicByCardId(cardId: number): string {
    let topic: string;
    allFlashcards.forEach(obj => {
      if (obj.id === cardId) {
        topic = obj.topic;
      } 
    });
    return topic;
  }

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
  }

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
    allFlashcards.forEach(obj => {
      if (this.filters.categories.includes(obj.category) 
          && this.filters.topics.includes(obj.topic) 
          && this.filters.types.includes(obj.type)) {
        count++
      }
    });
    this.cardsInDeck = count;
  }

}
