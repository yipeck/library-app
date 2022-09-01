import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { baseAPI } from '../config';

interface UserResponse {
  Success: boolean;
  Data: User;
  Message: string;
}

interface SignInResponse {
  Success: boolean;
  Token: string;
  Message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient
  ) { }

  isExist(body: FormData): Observable<UserResponse> {
    const url = `${baseAPI}/user/exist`;

    return this.http.post<UserResponse>(url, body);
  }

  signIn(body: FormData): Observable<SignInResponse> {
    const url = `${baseAPI}/user/signin`;

    return this.http.post<SignInResponse>(url, body);
  }

  signUp(body: FormData): Observable<UserResponse> {
    const url = `${baseAPI}/user/signup`;

    return this.http.post<UserResponse>(url, body);
  }

  getUserById(params: HttpParams): Observable<UserResponse> {
    const url = `${baseAPI}/user`;

    return this.http.get<UserResponse>(url, { params });
  }

  updateUser(params: HttpParams, body: FormData): Observable<UserResponse> {
    const url = `${baseAPI}/user/attr`;

    return this.http.post<UserResponse>(url, body, { params });
  }
}
