import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { PullRequestResponse } from "app/PullRequestResponse"
import { User } from "app/models/user";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GithubServiceService {
  private baseUrl = 'https://api.github.com'
  constructor(private http : Http) {
  }

  getAndroidPulls(): Observable<PullRequestResponse[]>{
     let androidPRs =  this.http
       .get(`https://api.github.com/repos/EdisonJunior/ring-android/pulls?access_token=4f8f055a9554e4bf237a0d35838523a2dd02c9c6&state=open&direction=desc`)
       .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

      // for(let pr in androidPRs){
      //   console.log(pr.id);
      // }

      return androidPRs;
  }

  // function mapPRs(response: Response): PullRequestResponse[]{
  //   return response.json().results.map(toPullRequest);
  // }
  //
  // function toPullRequest(r: any): PullRequestResponse{
  //   let pr = <PullRequestResponse>({
  //     title: r.title,
  //     created_at: r.created_at,
  //     id: r.id,
  //     isReviewed: isPRReviewed(r),
  //   });
  //
  //   return pr;
  // }
  //
  // function isPRReviewed(prData:any){
  //   return false;
  // }

}
