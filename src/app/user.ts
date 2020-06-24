import { Filters } from './filters';
import { Question } from './question';
import { Settings } from './settings';
import { Statistics } from './statistics';

export class User {

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
    filters: Filters;
    questions: Question[];
    settings: Settings;
    statistics: Statistics;
}
