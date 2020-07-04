import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HostListener } from "@angular/core";
import { PostService } from "./../services/post.service";
import { SendHttpRequestService } from "./../send-http-request.service";
import { jsonDecoder } from '../utils/jsonDecoder';
import { BufferToImage } from '../utils/bufferToImage';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private userService: SendHttpRequestService,
    private PostService: PostService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    let current_route = this._router.url.split("/");
    this.loadPosts(current_route[2]);

  }

  userInfo: any;
  bufferedImage: SafeUrl;
  postImages: any = [];
  posts: any;
  loadPosts(instaHandle: string) {
    this.PostService.getUsersPosts(instaHandle).subscribe((res) => {
      this.posts = res.payload.data.posts;
      this.fillPostImages();
    });

    this.userService.userInfo(jsonDecoder().data._id, null).subscribe((res) => {
      console.log(res);
      this.userInfo = res.body;
      this.bufferedImage = BufferToImage.bufferToImage(res.body.bufferedImage, this.domSanitizer);
    })
  }

  fillPostImages() {
    this.posts.map((post: any, index: number) => {
      if (post.image) {
        let TYPED_ARRAY = new Uint8Array(post.image.data);

        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');

        let base64String = btoa(STRING_CHAR);

        this.postImages[index] = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ` + base64String);
      }
      this.posts.postImages = this.postImages;
      return null;
    });

  }
}
