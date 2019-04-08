import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  
  constructor(private _appService: AppService, private _router: Router) {}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {
    console.log(this._router.url);
    if (!this._appService.checkLogin()) {
      return true;
    }else {
      this._appService.getRout();
      return false;
    }
  }
  
}
