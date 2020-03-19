import { Component, OnInit } from '@angular/core';
import { SendHttpRequestService } from '../send-http-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.css']
})
export class ProfileDashboardComponent implements OnInit {

  constructor(private sendReq: SendHttpRequestService, private _router:Router) { }

  name:string;
  username:string;
  followers:number;
  following:number;
  posts: number;
  bio:string;
  loggedinUserId: string;
  usersArray: any;
  followersArray=[]
  followingArray=[]
  editButton : Boolean=false;
  followButton:Boolean=false;
  unfollowButton : Boolean=false;
  
  ngOnInit() {
    let current_route = this._router.url.split("/");
    console.log(current_route, "------->>>>>> current route")
    this.loadUserData(current_route[2],null);
    // this.loadPosts();
  }

  loadPosts(){
    // this.sendReq.
  }

  loadUserData(id:string=null, instaHandle:string=null){
    this.sendReq.userInfo(id,instaHandle).subscribe(res => {
      if(res.status == 200){
        console.log(res.body[0]);
        this.usersArray = res.body[0];
        this.setUserData();
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
      
    });
  }

  setUserData(){
    this.name = this.usersArray.name;
    this.username = this.usersArray.instaHandle;
    this.followers = this.usersArray.followers;
    this.following = this.usersArray.following;
    this.posts = this.usersArray.postsCount;
    this.bio = this.usersArray.about;

    let current_route = this._router.url.split("/");
    
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    if (current_route[2] == loggedinUserId){
      this.editButton = true
      this.followButton = false
      this.unfollowButton = false
    }
    else{
      this.sendReq.checkFollow(current_route[2],loggedinUserId).subscribe(res => {
        if(res.status == 200){
          console.log(res.body);
          this.followButton = false
          this.unfollowButton = true
          this.editButton = false
        }
        else if(res.status == 404){
          this.followButton = true
          this.unfollowButton = false
          this.editButton = false
        }
        else if (res.status==401){
          localStorage.removeItem("token");
          this._router.navigate(['/login']);
        }
        
      });
      
      
    }
  }

  getFollowers(){
    let current_route = this._router.url.split("/");
   
    this.sendReq.getFollowersList(current_route[2]).subscribe(res => {
      if(res.status == 200){
        console.log(res.body);
        this.followersArray = res.body;
        console.log(this.followersArray, "------->>>>>> followers")
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
      
    });

  }

  getFollowing(){
    let current_route = this._router.url.split("/");
   
    this.sendReq.getFollowingList(current_route[2]).subscribe(res => {
      if(res.status == 200){
        console.log(res.body);
        this.followingArray = res.body;
        console.log(this.followingArray, "------->>>>>> followers")
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
      
    });

  }

  follow(){
    console.log("inside follow function")
    let current_route = this._router.url.split("/");
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    this.sendReq.followUser(current_route[2], loggedinUserId).subscribe(res => {
      console.log(res.status, res, "status ????")
      if(res.status == 200  || res.message =="now following user"){
        console.log(res.body, "following---->>>>");
        // this.followButton = false;
        // this.unfollowButton = true;
        // this.editButton = false
        this.loadUserData(current_route[2], null)
        
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
      
    });
  }

  unfollow(){
    console.log("inside unfollow function")
    let current_route = this._router.url.split("/");
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    this.sendReq.unfollowUser(current_route[2], loggedinUserId).subscribe(res => {
      console.log(res.status, res.message, "status ????")
      if(res.status == 200 || res.message =="unfollowing user"){
        console.log(res.body, "unfollowing---->>>>");
        // this.followButton = true;
        // this.unfollowButton = false;
        // this.editButton = false
        this.loadUserData(current_route[2], null)
        
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
      
    });
  }

  logout(){
    localStorage.removeItem("token");
    this._router.navigate(['/login']);
  }


}

