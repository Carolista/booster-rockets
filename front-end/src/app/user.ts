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

    constructor(firstName: string, lastName: string, email: string, password: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
