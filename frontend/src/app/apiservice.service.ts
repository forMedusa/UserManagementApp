import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {
 // private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  constructor(private http: HttpClient,
    private cookies: CookieService) { }

  loginUrl= 'http://localhost:4500/login';

  registerUrl= 'http://localhost:4500/register';

  getallUsersUrl = 'http://localhost:4500/allUsers';

  getOneUserUrl = 'http://localhost:4500/users/';

  updateUserUrl = 'http://localhost:4500/userUpdate/'

  deleteUserUrl = 'http://localhost:4500/userDelete/'

  loginCall(data:any):Observable<any>{
    return this.http.post(this.loginUrl,data);
  }

  register(data:any):Observable<any>{
    return this.http.post(this.registerUrl,data);
  }

  allUsers():Observable<any>{
    return this.http.get(this.getallUsersUrl);
  }

  getOneUser(email:any):Observable<any>{
    return this.http.get(this.getOneUserUrl+email)
  }

  userUpdate(data:any):Observable<any>{
    return this.http.put(this.updateUserUrl+data.id, data);
  }

  deleteUser(id:any){
    return this.http.delete(this.deleteUserUrl+id)
  }
  hasValidToken(): boolean {
    const token = this.cookies.get('token');
    if(token){
      return true
    }else{
      return false;
    }
  }

  // isAuthenticated(): Observable<boolean> {
  //   return this.isAuthenticatedSubject.asObservable();
  // }
}
