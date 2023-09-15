import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit{
  constructor(private service: ApiserviceService) { }
  ngOnInit(){
    this.getAllUsers()
  }
  users:any;
  getAllUsers(){
    this.service.allUsers().subscribe(user => {
      this.users = user.data
    })
  }
}
