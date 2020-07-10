import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'booster-rockets';

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
    } else {
      this.isLoggedIn = false; // necessary to keep header, navbar, and footer from showing
    }
  }
 
  logout() {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    // TODO: need to adjust for reloading page to get isLoggedIn to trigger hidden navbar?
  }
}
