import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { SendHttpRequestService } from '../send-http-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { BufferToImage } from '../utils/bufferToImage';
import { DomSanitizer } from '@angular/platform-browser';
import { jsonDecoder } from '../utils/jsonDecoder';
import { FileUploadService } from "../services/fileUpload.service";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-profile-dashboard',
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.css']
})
export class ProfileDashboardComponent implements OnInit {

  constructor(private sendReq: SendHttpRequestService,
    private _router: Router,
    private domSanitizer: DomSanitizer,
    private fileUploadService: FileUploadService) { }

  name: string;
  username: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
  loggedinUserId: string;
  loggedinUserInstaHandle: string;
  usersArray: any;
  followersArray = []
  followingArray = []
  editButton: Boolean = false;
  followButton: Boolean = false;
  unfollowButton: Boolean = false;
  currentProfileId: string;
  image: any;

  ngOnInit() {
    this.loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    this.loggedinUserInstaHandle = this.sendReq.jsonDecoder(localStorage.getItem("token")).data.instaHandle

    let current_route = this._router.url.split("/");
    this.loadUserData(this.currentProfileId, current_route[2]);
  }


  loadPosts() {
    // this.sendReq.
  }
  images: any;

  selectImage(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;

      this.onSubmit();
    }
  }
  onSubmit() {
    const formData = new FormData();
    formData.append('image', this.images);


    const _id = jsonDecoder().data.instaHandle;
    this.fileUploadService.fileUpload(formData, _id).subscribe((res: any) => {
      alert('Successful');
    });
  }

  loadUserData(id: string = null, instaHandle: string = null) {

    if (id != null) {
      this.currentProfileId = id;
    }



    this.sendReq.userInfo(id, instaHandle).subscribe(res => {
      if (res.status == 200) {

        this.usersArray = res.body.user;
        this.image = res.body.bufferedImage ? BufferToImage.bufferToImage(res.body.bufferedImage, this.domSanitizer) : null;
        this.setUserData();

      }
      else if (res.status == 401) {
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
    });
  }

  setUserData() {

    let current_route = this._router.url.split("/");

    this.name = this.usersArray.name;
    this.username = this.usersArray.instaHandle;
    this.followers = this.usersArray.followers;
    this.following = this.usersArray.following;
    this.posts = this.usersArray.postsCount;
    this.bio = this.usersArray.about;


    if (this.loggedinUserInstaHandle == current_route[2]) {

      this.editButton = true
      this.followButton = false
      this.unfollowButton = false
    }
    else {
      this.sendReq.checkFollow(current_route[2], this.loggedinUserId).subscribe(res => {

        if (res.body.success == true) {
          this.followButton = false
          this.unfollowButton = true
          this.editButton = false
        }
        else if (res.body.success == false) {
          this.followButton = true
          this.unfollowButton = false
          this.editButton = false
        }
        else if (res.status == 401) {
          localStorage.removeItem("token");
          this._router.navigate(['/login']);
        }
      });
    }
  }

  getFollowers() {
    let current_route = this._router.url.split("/");

    this.sendReq.getFollowersList(current_route[2]).subscribe(res => {

      this.followersArray = res.payload.data.allFollowers;

      if (res.status == 401) {
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
    });
  }

  getFollowing() {

    let current_route = this._router.url.split("/");
    this.sendReq.getFollowingList(current_route[2]).subscribe(res => {

      this.followingArray = res.payload.data.allFollowing;

      if (res.status == 401) {
        localStorage.removeItem("token");
        this._router.navigate(['/login']);
      }
    });
  }

  followObj() {
    let current_route = this._router.url.split("/");
    this.follow(current_route[2])
  }

  follow(ownerId) {
    let current_route = this._router.url.split("/");
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    this.sendReq.followUser(ownerId, loggedinUserId).subscribe(res => {
      if (res.status == 200) {
        if (current_route[2] == ownerId) {
          this.loadUserData(null, ownerId)
        }
        else {
          this.getFollowers();
          this.getFollowing()

        }

      }
      else if (res.status == 401) {
        localStorage.removeItem("token");
        this._router.navigate(['/login']);

      }
    });
  }

  unfollowObj() {
    let current_route = this._router.url.split("/");
    this.unfollow(current_route[2])
  }

  unfollow(ownerId) {
    let current_route = this._router.url.split("/");
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token")).data._id
    this.sendReq.unfollowUser(ownerId, loggedinUserId).subscribe(res => {
      if (res.status == 200) {

        if (current_route[2] == ownerId) {
          this.loadUserData(null, ownerId)

        }
        else {
          this.getFollowers();
          this.getFollowing()
          this.loadUserData(null, current_route[2])
        }
        return true

      }
      else if (res.status == 401) {

        localStorage.removeItem("token");
        this._router.navigate(['/login']);
        return false
      }
    });
  }

  logout() {
    localStorage.removeItem("token");
    this._router.navigate(['/login']);
  }
}