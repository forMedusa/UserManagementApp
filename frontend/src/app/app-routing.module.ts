import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AllusersComponent } from './allusers/allusers.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { AuthGuard } from './auth.guard'
const routes: Routes = [
  {
  path: '',
  component: HomepageComponent
},
{
  path: 'users',
  component: AllusersComponent,
  canActivate: [AuthGuard]
},
{
  path: 'profile',
  component: UserProfileComponent,
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
