import { Component, ViewChild } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;
  lat: number;
  lng: number;

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl('guest@apex.com', [Validators.required]),
    password: new UntypedFormControl('Password', [Validators.required]),
    rememberMe: new UntypedFormControl(true)
  });


  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
    });
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    // this.authService.signinUser(this.loginForm.value.username, this.loginForm.value.password)
    //   .then((res) => {
    //     this.spinner.hide();
    //     this.router.navigate(['/dashboard/dashboard1']);
    //   })
    //   .catch((err) => {
    //     this.isLoginFailed = true;
    //     this.spinner.hide();
    //     console.log('error: ' + err)
    //   }
    //   );


    const userLogin = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      latitude: 979879879,
      longitude: 879798789
    }

    this.authService.login(userLogin).subscribe(res => {
      this.spinner.hide();
        this.router.navigate(['/dashboard/dashboard1']);
    }, error => {
      this.isLoginFailed = true;
      this.spinner.hide();
      console.log('errorsss: ' + error)
    })
  }

}
