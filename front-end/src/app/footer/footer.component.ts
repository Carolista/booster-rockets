import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

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
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
  }

}
