import { Component, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
 
 
  title = 'vaccine-ui';
  color = 'primary';
  mode = 'indeterminate';

  isLoggedin = false;
  isLoading = false;
  constructor(private _appService: AppService){}

  ngOnInit(): void {
    this._appService.isLoggedin.subscribe(isLoggedin => this.isLoggedin = isLoggedin);
    this._appService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
    this.isLoggedin = this._appService.checkLogin();
  }

  logout(){
    this._appService.logout();
    this.isLoggedin = false;
  }
}
