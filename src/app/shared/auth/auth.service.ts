import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserAuth } from 'app/pages/full-pages/users/models/user-auth';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CommonError } from './common-error';
import { CommonHttpErrorService } from './common-http-error.service';
import { User } from 'app/pages/full-pages/users/models/user';

@Injectable()
export class AuthService {

  private _securityObject$: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);

  public get securityObject$(): Observable<UserAuth> {
    return this._securityObject$.pipe(
      map(c => {
        if (c) {
          return c;
        }
        const currenyData = localStorage.getItem('authObj');
        if (currenyData) {
          this._securityObject$.next(JSON.parse(currenyData))
          return JSON.parse(currenyData);
        }
        return null;
      })
    );
  }

  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService,
    public router: Router
    ) {

  }

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user

  }

  login(entity: any): Observable<UserAuth | CommonError> {
    // Initialize security object
    //this.resetSecurityObject();
    console.log("UserLogin", entity);
    return this.http.post<UserAuth>(`api/User/login`, entity)
      .pipe(
        tap((resp) => {
          console.log("RespFirstName", resp.firstName);
          localStorage.setItem('authObj', JSON.stringify(resp));
          localStorage.setItem('bearerToken', resp.bearerToken);
          this._securityObject$.next(resp);
        })
      ).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  logout(): void {
    this.resetSecurityObject();
  }

  resetSecurityObject(): void {
    localStorage.removeItem('authObj');
    localStorage.removeItem('bearerToken');
    this._securityObject$.next(null);
    this.router.navigate(['/auth/login']);
  }

  changePassword(user: any): Observable<User | CommonError> {
    const url = `api/user/changepassword`;
    return this.http.post<User>(url, user)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  isAuthenticated(): boolean {
    const authStr = localStorage.getItem('authObj');
    if (authStr)
      return true;
    else
      return false;
  }

  currentUser(): any {
    return JSON.parse(localStorage.getItem('authObj'));
  }
}
