import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  activeLink: string = "dashboard";

  constructor(private router: Router, private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    
  }

}
