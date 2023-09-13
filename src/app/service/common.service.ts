import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseUrl = "https://backendmerchant-production.up.railway.app/v1/"
  private merchantEndpoint = "merchant"
  private userEndpoint = "user"
  private reviewEndpoint = "review"

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  signUpUser(username: string, password: string, email: string): Observable<any> {
    return this.http.put(this.baseUrl + this.userEndpoint + "/create", '{"username":"' + username + '", "password":"' + password + '", "email":"' + email + '"}', this.httpOptions)
  }

  loginUser(username: string): Observable<any> {
    return this.http.post(this.baseUrl + this.userEndpoint + "/find/username", '{"username":"' + username + '"}', this.httpOptions)
  }

  resetUser(userId:string, password:string): Observable<any> {
    return this.http.post(this.baseUrl + this.userEndpoint + "/reset/confirm", '{"userId":' + userId + ', "password":"' + password + '"}', this.httpOptions)
  }

  getAllMerchants(): Observable<any> {
    return this.http.get(this.baseUrl + this.merchantEndpoint, this.httpOptions)
  }

  loadAllReviews(merchantId: number): Observable<any> {
    return this.http.get(this.baseUrl + this.reviewEndpoint + "/merchant/" + merchantId, this.httpOptions)
  }

  createReview(image: File, merchantId: number, userId: number, feedback: string, rating: number): Observable<any> {
    const reviewDetails = {
      merchantId: merchantId,
      userId: userId,
      feedback: feedback,
      rating: rating
    };
    let formData = new FormData();
    formData.append("image", image)
    formData.append("reviewDetails", JSON.stringify(reviewDetails))

    return this.http.put(this.baseUrl + this.reviewEndpoint + "/create", formData)
  }

  createGetRequest(url: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(url)
  }

  createPostRequest(url: string, payload: any): Observable<HttpResponse<any>> {
    return this.http.post(url, payload, { observe: 'response' })
  }

  createPutRequest(url: string, payload: any): Observable<HttpResponse<any>> {
    return this.http.put(url, payload, { observe: 'response' })
  }

  createDeleteRequest(url: string): Observable<HttpResponse<any>> {
    return this.http.delete(url, { observe: 'response' })
  }


}
