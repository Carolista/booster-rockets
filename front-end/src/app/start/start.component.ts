import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private router: Router, private tokenStorageService: TokenStorageService) { }

  ngOnInit() {
    if (!this.tokenStorageService.getToken()) {
      this.router.navigate(['/login'])
    } 
  }

}
