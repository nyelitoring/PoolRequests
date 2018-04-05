import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from "app/models/user";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';


@Injectable()
export class GithubServiceService {
  baseUrl = 'https://api.github.com';
  access_token = '';
  state = 'open';
  direction = 'desc';
  repo = 'ring-android';
  constructor(private http: Http) {
  }

  getAndroidPulls(): Observable<any[]> {
    return this.http.get(this.baseUrl + `/repos/EdisonJunior/` + this.repo
      + `/pulls?access_token=` + this.access_token + `&state=` + this.state
      + `&direction=` + this.direction)
      .map((res: any) => res.json())
      .flatMap((prs: any[]) => {
        if (prs.length > 0) {
          return Observable.forkJoin(
            prs.map((pr: any) => {
              return this.http.get(pr.comments_url + '?access_token=' + this.access_token)
                .map((res: any) => {
                  let comments: any = res.json();


                  if(pr.base.ref != 'develop'){
                    return undefined;
                  }
                  comments.forEach(comment => {
                    // console.log(comment.body);
                    if (comment.body.includes('shipit')) {
                      return undefined;
                    }
                  })

                  var timeInMillis = new Date().getTime() - new Date(pr.created_at).getTime();
                  pr.timeSinceCreation = Math.trunc((timeInMillis / 1000) / 60);
                  return pr;
                });
            })
          );
        }
        return Observable.of([]);
      });
  }

  getComments(commentsUrl: string): Observable<Comment[]> {
    return this.http
      .get(commentsUrl + '?access_token=' + this.access_token)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }



}
