import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor(private service: ApiserviceService, 
    private cookies: CookieService,
    private router: Router) {}
  ngOnInit(): void {
      this.check()
  }
  @ViewChild('signupModal') signupModal!: ElementRef;
  @ViewChild('loginModal') loginModal!: ElementRef;

   
  
  islogin = false;
  

  userSignup = new FormGroup({
    name: new FormControl('',
    [Validators.required,
    Validators.pattern(/^[a-zA-Z\s]*$/)]),
    mobile: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })

  userLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  invalidCredentials = '';
  invalidpass = false
  userDetails:any;

  signup(){
    this.userDetails = this.userSignup.value
    this.service.register(this.userDetails).subscribe(data=>{
      console.log(data);
      this.signupModal.nativeElement.click();
      this.router.navigateByUrl('/users');
    })
  }
  check(){
    this.islogin = this.service.hasValidToken();
  }
  login(){
    this.userDetails = this.userLogin.value
    this.service.loginCall(this.userDetails).subscribe((data) => {
      this.invalidpass = false;
      console.log(data)
      const token = data.token;
      this.cookies.set('token', token);
      this.cookies.set('email', data.userData.email);
      console.log(token)
      this.loginModal.nativeElement.click();
      
      this.router.navigateByUrl('/profile');
    },
    (error) => {
      if (error.status === 401) {
        // Handle 401 Unauthorized error here
        // You can display an error message or perform any other action
        console.error('Unauthorized: Please check your credentials.');
        this.invalidCredentials = 'Authentication failed. Invalid email or password.';
        this.invalidpass = true;
      } else {
        // Handle other errors here
        console.error('An error occurred:', error);
      }
    })
  }
}
