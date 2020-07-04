//import { ModalComponent } from './modal/modal.component';
import { SuggestionForUComponent } from "./suggestion-for-u/suggestion-for-u.component";
import { AuthGuard } from "./auth.guard";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { CreatePostComponent } from "./create-post/create-post.component";
import { AddFeedComponent } from './add-feed/add-feed.component';
//import { FileSelectDirective } from 'ng2-file-upload';
import { FeedComponent } from './feed/feed.component';
import { AppComponent } from './app.component';
import { ProfileDashboardComponent } from './profile-dashboard/profile-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChangePasswordComponent } from './change-password/change-password.component'
import { EditProfileDetailsComponent } from './edit-profile-details/edit-profile-details.component';
import { ViewPostComponent } from './view-post/view-post.component'
import { LoginPageComponent } from './login-page/login-page.component';


const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "signup", component: SignupComponent },
  {
    path: "feed", component: FeedComponent, canActivate: [AuthGuard],

    // children:[
    //   {
    //     path: "likes",
    //     component: ModalComponent,
    //     canActivate: [AuthGuard]
    //   }
    // ]
  },

  {
    path: "profile/:id",
    component: ProfileDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "uploadPost",
    component: CreatePostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "suggests",
    component: SuggestionForUComponent,
    canActivate: [AuthGuard]
  },
  { path: 'post', component: AddFeedComponent },
  {
    path: "accounts/edit",
    component: EditProfileComponent,
    children: [
      {
        path: "",
        redirectTo: "editProfileDetails",
        pathMatch: "full",
        canActivate: [AuthGuard]
      },
      {
        path: "editProfileDetails",
        component: EditProfileDetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: "changePassword",
        component: ChangePasswordComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: "post/:id", component: ViewPostComponent,

    // children:[
    //   {
    //     path: "likes",
    //     component: ModalComponent,
    //     canActivate: [AuthGuard]
    //   }
    // ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
