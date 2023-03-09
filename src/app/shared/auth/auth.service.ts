import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from 'firebase/app'
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
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

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
    public _firebaseAuth: AngularFireAuth,
    private commonHttpErrorService: CommonHttpErrorService,
    public router: Router
    ) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
      }
    );

  }

  signupUser(email: string, password: string) {
    //your code for signing up the new user
  }

  signinUser(email: string, password: string) {
    //your code for checking credentials and getting tokens for for signing in user
    return this._firebaseAuth.signInWithEmailAndPassword(email, password)

  }

  login(entity: any): Observable<UserAuth | CommonError> {
    // Initialize security object
    //this.resetSecurityObject();
    console.log("UserLogin", entity);
    return this.http.post<UserAuth>(`https://localhost:5001/api/User/login`, entity)
      .pipe(
        tap((resp) => {
          localStorage.setItem('authObj', JSON.stringify(resp));
          localStorage.setItem('bearerToken', resp.bearerToken);
          this._securityObject$.next(resp);
        })
      ).pipe(catchError(this.commonHttpErrorService.handleError));
  }

  resetSecurityObject(): void {
    localStorage.removeItem('authObj');
    localStorage.removeItem('bearerToken');
    this._securityObject$.next(null);
    this.router.navigate(['/login']);
  }

  logout() {
    this._firebaseAuth.signOut();
    this.router.navigate(['YOUR_LOGOUT_URL']);
  }

  isAuthenticated() {
    return true;
  }
}
