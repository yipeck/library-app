import { HttpParams } from "@angular/common/http";

export class AuthService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  getAuthParams(): HttpParams {
    const httpParams = new HttpParams();
    
    return httpParams.append('token', this.token);
  }

  expandAuthParams(options: any): HttpParams {
    const httpParams = new HttpParams();

    options['token'] = this.token;
  
    return httpParams.appendAll(options);
  }
}
