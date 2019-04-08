import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Route } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading:boolean = false;
  options: FormGroup;
  hidePassword: boolean = true;
  constructor(fb: FormBuilder, private snackBar: MatSnackBar, private _appService: AppService) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this._appService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
  }

  login() {
    console.log(this.options.controls.username);
    if(this.options.invalid) return;
    this._appService.setLoading(true);
    console.log(this.username);
    this._appService.login(this.username, this.password)
    .subscribe(data => {
      console.log(data);
      this._appService.setSession(this.username, data);
      this._appService.getRout();
      
      this._appService.setLoading(false);
      this.openSnackBar('Authorization succeeded', 'OK', 'snack-success');
    },
      error => {
        console.log(error);

        this._appService.setLoading(false);
        this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
      });
      
  }

  openSnackBar(msg, action, colorClass) {
    this.snackBar.open(msg, action, {
      duration: 2000,
      panelClass: colorClass
    });
  }

  test(){
    console.log(this.options);
    this.isLoading = !this.isLoading;
    this._appService.setLogin(true);
    this._appService.setLoading(this.isLoading);
  }

  get username(){
    return this.options.controls.username.value;
  }

  get password(){
    return this.options.controls.password.value;
  }

}
