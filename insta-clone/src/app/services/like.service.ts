import { IResponse } from './../models/IResponse';
import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LikeService {
    headers: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
    });

    constructor(private http: HttpClient) { }

    like(postId: string, operation: string): Observable<IResponse> {
        const queryParams: HttpParams = new HttpParams()
            .set("type", "like")
            .set("operation", operation);

        const httpOptions = {
            headers: this.headers,
            params: queryParams
        };


        return this.http.patch<IResponse>(`http://localhost:3000/api/operation/${postId}`, {}, httpOptions);
    }

    getLikes(id: string): Observable<IResponse> {

        const httpOptions = {
            headers: this.headers
        };

        return this.http.get<IResponse>(`http://localhost:3000/likes/${id}`, httpOptions);
    }

}