import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule,FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private service: ApiserviceService,
    private cookies:CookieService,
    private router: Router){}

  ngOnInit(){
    this.getuserData()
  }
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  @ViewChild('editModal') editModal!: ElementRef;
  EditUser = new FormGroup({
    name: new FormControl('',
    [Validators.required,
    Validators.pattern(/^[a-zA-Z\s]*$/)]),
    mobile: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })
  userDetails:any;

  userData={
    id: '',
    name: '',
    mobile: '',
    email: '',
    password: ''
  }
  
  getuserData(){
    const email = this.cookies.get('email');
    this.service.getOneUser(email).subscribe(res => {
      this.userData.id = res.data._id;
      this.userDetails = res.data;
      console.log(this.userData.id)
      this.userData.name = res.data.name
      this.userData.mobile = res.data.mobile
      this.userData.email = res.data.email
      this.userData.password = res.data.password
      console.log(this.userDetails)
    })
  }

  updateUser(){
      this.userDetails = this.EditUser.value;
      console.log(this.userData.name)
      this.userData.name = this.userDetails.name
      this.userData.mobile = this.userDetails.mobile
      this.userData.email = this.userDetails.email
      this.userData.password = this.userDetails.password
      this.cookies.delete('email');
      this.cookies.set('email',this.userData.email)
    this.service.userUpdate(this.userData).subscribe(res => {
      this.editModal.nativeElement.click();
      console.log(res)
    })
  }

  userDelete(){
    this.service.deleteUser(this.userData.id).subscribe(res => {
      console.log(res)
      this.cookies.delete('email');
      this.cookies.delete('token');
      this.deleteModal.nativeElement.click();
      this.router.navigateByUrl('/')
    })
  }
}
