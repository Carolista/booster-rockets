import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { User } from 'src/app/user'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailSaved: string;
  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  roles: string[] = [];
  id: number;
  passwordMismatch: boolean = false;
  user: User = new User("", "", "", "", null, [], null, null); // for ngModel binding
  verify: string;
  form: any = {};

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit() {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/start']); // TODO: keep or change
    } 

  }

  checkVerify() {
    if (this.verify === this.user.password) {
      this.passwordMismatch = false;
    } else {
      this.passwordMismatch = true;
    }
  }

  saveUser() {

    // don't submit form if passwords mismatch
    if(this.user.password !== this.verify) {
      this.passwordMismatch = true;
      console.log("password mismatch")
      return;
    }

    // values are already saved in user object due to ngModel binding
    console.log("saved user", this.user);

    // this.authService.register(this.user).subscribe(
    //   data => {
    //     console.log(data);
        
    //     this.isSuccessful = true;
    //     this.isSignUpFailed = false;
    //     this.tokenStorage.saveToken(data.token);
    //     this.tokenStorage.saveUser(data);
    //     console.log(data.token);
    //     this.isLoginFailed = false;
    //     this.isLoggedIn = true;

    //     this.tokenStorage.saveUser(data);
    //     this.reloadPage();
        
    //   },
    //   err => {
    //     this.errorMessage = err.error.message;
    //     this.isSignUpFailed = true;
    //   }
    // );

  }

  reloadPage() {
    window.location.reload();
  }

}
