import { ChangePasswordComponent } from "./change-password/change-password.component";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError, map, tap, retry } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Token } from "@angular/compiler/src/ml_parser/lexer";

@Injectable({
  providedIn: "root"
})
export class SendHttpRequestService {
  constructor(private http: HttpClient) { }

  private log(message: string) {
  }
  // //Decode JWT and return the Payload in JSON Format
  jsonDecoder = token => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  header_token: HttpHeaders = new HttpHeaders().set(
    "token",
    localStorage.getItem("token")
  );

  signMeUp(obj): Observable<any> {
    return this.http
      .post("http://localhost:3000/signup", obj, { observe: "response" })
      .pipe(
        tap(_ => this.log("Signed Up")),
        catchError(this.handleError<any>("Some Error Occurred"))
      );
  }

  logMeIn(obj): Observable<any> {
    return this.http
      .post("http://localhost:3000/login", obj, {
        observe: "response",
        responseType: "json"
      })
      .pipe(
        tap(_ => this.log("Log In")),
        catchError(this.handleError<any>("logMeIn ?"))
      );
  }

  checkIfDuplicate(obj): Observable<any> {
    return this.http
      .put("http://localhost:3000/checkIfDuplicate", obj, {
        observe: "response",
        responseType: "json"
      })
      .pipe(
        tap(_ => this.log("checked")),
        catchError(this.handleError<any>("checked"))
      );
  }

  updateData(object: any, id: string): Observable<any> {
    return this.http
      .put(`http://localhost:3000/user/${id}`, object, {
        observe: "response",
        headers: this.header_token
      })
      .pipe(
        tap(_ => this.log("updating details")),
        catchError(this.handleError<any>("error in details"))
      );
  }

  ChangePassword(object: any, id: string): Observable<any> {
    return this.http
      .patch(`http://localhost:3000/changePassword/${id}`, object, {
        observe: "response",
        headers: this.header_token
      })
      .pipe(
        tap(_ => this.log("updating details")),
        catchError(this.handleError<any>("error in details"))
      );
  }

  userInfo(id: string, instaHandle: string): Observable<any> {
    return this.http
      .get(
        "http://localhost:3000/user/?" +
        "id=" +
        id +
        "&instaHandle=" +
        instaHandle,
        { headers: this.header_token, observe: "response" }
      )
      .pipe(
        tap(_ => this.log("showing details")),
        catchError(this.handleError<any>("error in details"))
      );
  }

  getFollowersList(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/followers/${id}`, {
      headers: this.header_token
    });
  }

  getFollowingList(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/following/${id}`, {
      headers: this.header_token
    });
  }

  likePost(obj): Observable<any> {
    return this.http.put("http://localhost:3000/like", obj).pipe(
      tap(_ => this.log("Liked Picture")),
      catchError(this.handleError<any>("error in liking post"))
    );
  }

  commentPost(obj): Observable<any> {
    return this.http.post("http://localhost:3000/comment", obj).pipe(
      tap(_ => this.log("Commented")),
      catchError(this.handleError<any>("error in commenting on post"))
    );
  }

  followUser(ownerId: string, followerId: string): Observable<any> {
    const queryParams: HttpParams = new HttpParams()
      .set("ownerId", ownerId)
      .set("followerId", followerId);
    return this.http.put(
      "http://localhost:3000/follow",
      {},
      { headers: this.header_token, observe: "response", params: queryParams }
    );
  }

  unfollowUser(ownerId: string, unfollowerId: string): Observable<any> {
    const queryParams: HttpParams = new HttpParams()
      .set("ownerId", ownerId)
      .set("unfollowerId", unfollowerId);
    return this.http.put(
      "http://localhost:3000/unfollow",
      {},
      { headers: this.header_token, observe: "response", params: queryParams }
    );
  }

  searchUsers(term: string): Observable<any> {
    if (!term.trim()) {
      // if not search term, return empty users array.
      return of([]);
    } //(`${this.heroesUrl}/?name=${term}`)
    return this.http
      .get(`http://localhost:3000/users?instaHandle=${term}`, {
        headers: this.header_token
      })
      .pipe(
        tap(_ => this.log("display users")),
        catchError(this.handleError<any>("error in loading"))
      );
  }

  checkFollow(ownerId: string, followerId: string): Observable<any> {
    return this.http
      .get(
        "http://localhost:3000/followRelation/?" +
        "ownerId=" +
        ownerId +
        "&followerId=" +
        followerId,
        { headers: this.header_token, observe: "response" }
      )
      .pipe(
        tap(_ => this.log("Following")),
        catchError(this.handleError<any>("error in following"))
      );
  }
  showSuggestion(): Observable<any> {
    return this.http
      .get("http://localhost:3000/suggestions", { headers: this.header_token })
      .pipe(
        tap(_ => this.log("Suggestions")),
        catchError(this.handleError<any>("error"))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error.status); // log to console instead

      // TODO: better job of transforming error for user consumption

      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  }
}
