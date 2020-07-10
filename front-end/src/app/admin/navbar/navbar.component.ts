import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  activeLink: string = "start";

  roles: string[] = [];
  isLoggedIn = false;
  mySubscription: any;

  constructor(private router: Router, private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.load();
  }
 
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
 
 
  load() {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorageService.getUser().roles;
    } 
  }
 
  logout() {
    // console.log(this.tokenStorageService.getUser());
    console.log("User " + this.tokenStorageService.getUser().id + " has logged out.");
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
  }

}
