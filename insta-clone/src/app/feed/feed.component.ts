import { LikeService } from './../services/like.service';
import { PostService } from "./../services/post.service";

import { SendHttpRequestService } from "./../send-http-request.service";
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  Injectable,
} from "@angular/core";

import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { jsonDecoder } from '../utils/jsonDecoder';
import { BufferToImage } from '../utils/bufferToImage';
import { IResponse } from '../models/IResponse';

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-feed",
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"],
})
export class FeedComponent implements OnInit {
  constructor(
    private sendReq: SendHttpRequestService,
    private PostService: PostService,
    private userService: SendHttpRequestService,
    private domSanitizer: DomSanitizer,
    private LikeService: LikeService,
    private dialog: MatDialog

  ) { }
  @ViewChild("modal", { static: false }) modal: ElementRef;
  @ViewChild("caption", { static: false }) caption: ElementRef;
  @ViewChild("commentarea", { static: false }) commentarea: ElementRef;
  show: Boolean = false;
  buttonName: String = "follow";
  follow() {
    this.show = !this.show;
    if (this.show) this.buttonName = "follow";
    else this.buttonName = "unfollow";
  }


  res: any;
  feed: any;

  openDialog(postId: string) {
    this.dialog.open(ModalComponent, {
      data: {
        postId: postId
      }
    });
  }

  ngOnInit() {
    this.loadPosts();
  }
  openModal() {
    this.modal.nativeElement.style.display = "flex";
  }

  closeModal() {
    this.modal.nativeElement.style.display = "none";
  }

  userInfo: any;
  bufferedImage: SafeUrl;

  postImages: any = [];
  loadPosts() {
    this.PostService.getFeed().subscribe((res) => {
      this.feed = res.payload.data.feedFinal;
      this.fillPostImages();
    });

    this.userService.userInfo(jsonDecoder().data._id, null).subscribe((res) => {
      console.log(res.body, 'res.body');
      this.userInfo = res.body.user;
      this.bufferedImage = res.body.bufferedImage && BufferToImage.bufferToImage(res.body.bufferedImage, this.domSanitizer);
    })
  }

  fillPostImages() {
    this.feed.map((post: any, index: number) => {
      if (post.post.image) {
        let TYPED_ARRAY = new Uint8Array(post.post.image.data);

        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');

        let base64String = btoa(STRING_CHAR);

        this.postImages[index] = this.domSanitizer.bypassSecurityTrustUrl(`data:image/jpg;base64, ` + base64String);
      }

      this.postUserImages[index] = post.post.user.userImage ?
        BufferToImage.bufferToImage(post.post.user.userImage, this.domSanitizer) : null;
    });

  }

  postUserImages: SafeUrl[] = [];

  toggleLike(postId, operation) {

    this.LikeService.like(postId, operation).subscribe(res => {
      this.loadPosts();
    })
  }

  reloadPosts() {
    this.loadPosts();
  }

  createComment(content: string, postId: string) {
    this.PostService.createComment(postId, content, 'inc').subscribe((res: IResponse) => {
      this.loadPosts();

    });
  }

}
