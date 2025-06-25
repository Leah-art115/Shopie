import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = 'http://localhost:3000/popup'; 

    constructor(private http: HttpClient) {}

    getPopupMessage(): Observable<{ title: string; message: string }> {
        return this.http.get<{ title: string; message: string }>(`${this.apiUrl}/message`);
    }
}