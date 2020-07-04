import { Observable } from "rxjs";
import { OnInit } from "@angular/core";
import { SendHttpRequestService } from "../send-http-request.service";
import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileUploadService } from "../services/fileUpload.service";
//3rd Party
import { FileUploader } from "ng2-file-upload";
import { jsonDecoder } from '../utils/jsonDecoder';
import { BufferToImage } from '../utils/bufferToImage';
import { DomSanitizer } from '@angular/platform-browser';

const URL = "http://localhost:3000/api/upload";

@Component({
  selector: "app-edit-profile-details",
  templateUrl: "./edit-profile-details.component.html",
  styleUrls: ["./edit-profile-details.component.css"]
})
export class EditProfileDetailsComponent implements OnInit {
  constructor(
    private domSanitizer: DomSanitizer,
    private sendReq: SendHttpRequestService,
    private _router: Router,
    private fileUploadService: FileUploadService,
    private el: ElementRef
  ) { }

  @ViewChild("uname", { static: false }) uname: ElementRef;
  @ViewChild("uinstaHandle", { static: false }) uinstaHandle: ElementRef;
  @ViewChild("uabout", { static: false }) uabout: ElementRef;
  @ViewChild("uphone", { static: false }) uphone: ElementRef;
  @ViewChild("uprofileImage", { static: false }) uprofileImage: ElementRef;
  @ViewChild("uwebsite", { static: false }) uwebsite: ElementRef;
  @ViewChild("ugender", { static: false }) ugender: ElementRef;
  @ViewChild("uemail", { static: false }) uemail: ElementRef;
  @ViewChild("updateButton", { static: false }) updateButton: ElementRef;

  res: any;
  usersData: any;
  name: string;
  username: string;
  bio: string;
  email: string;
  phone: Number;
  gender: string;
  profileImage: any;
  website: string;
  warningText: string;
  warning: boolean = false;

  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: "photo"
  });

  ngOnInit() {
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token"))
      .data._id;
    this.loadUserData(loggedinUserId, null);

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
    };
  }
  update() {
    let loggedinUserId = this.sendReq.jsonDecoder(localStorage.getItem("token"))
      .data._id;
    let userObj = {
      name: this.uname.nativeElement.value,
      instaHandle: this.uinstaHandle.nativeElement.value,
      about: this.uabout.nativeElement.value,
      phone: this.uphone.nativeElement.value,
      email: this.uemail.nativeElement.value,
      // profileImage: this.uprofileImage.nativeElement.value,
      website: this.uwebsite.nativeElement.value,
      gender: this.ugender.nativeElement.value
    };

    this.sendReq.updateData(userObj, loggedinUserId).subscribe(res => {
      if (res.status == 200) {
      } else if (res.status == 406) {
        this.warningText = res.error.message;
        this.warning = true;
      } else if (res.status == 401) {
        alert("Unauthorized");
        localStorage.removeItem("token");
        this._router.navigate(["/login"]);
      }
    });
  }

  loadUserData(id: string = null, instaHandle: string = null) {
    this.sendReq.userInfo(id, null).subscribe(res => {
      if (res.status == 200) {
        this.usersData = res.body.user;
        this.image = res.body.bufferedImage ? BufferToImage.bufferToImage(res.body.bufferedImage, this.domSanitizer) : null;
        this.setUserData();
      } else if (res.status == 401) {
        localStorage.removeItem("token");
        this._router.navigate(["/login"]);
      }
    });
  }
  image: any;
  setUserData() {
    this.name = this.usersData.name;
    this.username = this.usersData.instaHandle;
    this.email = this.usersData.email;
    this.phone = this.usersData.phone;
    this.bio = this.usersData.about;
    this.profileImage = this.usersData.profileImage;
    this.website = this.usersData.website;
    this.gender = this.usersData.gender;
  }
  readURL() {
    const preview = document.getElementById("profilePic") as HTMLImageElement;
    const file = (<HTMLInputElement>(
      document.getElementById("profileImageInput")
    )).files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        preview.src = String(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  radioButtonValue(genderValue: string) {
    (<HTMLInputElement>(
      document.getElementById("genderInput")
    )).value = genderValue;
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


}
