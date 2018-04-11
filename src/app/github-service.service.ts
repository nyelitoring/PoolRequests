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
  access_token = '2d32d2c654a84b5f311be80f9e883878663c8817';
  state = 'open';
  direction = 'desc';
  newCutOffMinutes = 15;

  constructor(private http: Http) {
  }

  getPullRequests(repo): Observable<any[]> {
    return this.http.get(this.baseUrl + `/repos/EdisonJunior/` + repo
      + `/pulls?access_token=` + this.access_token + `&state=` + this.state
      + `&direction=` + this.direction)
      .map((res: any) => res.json())
      .flatMap((prs: any[]) => prs)
      .flatMap(pr => {
        return Observable.forkJoin(
          Observable.of(pr),
          this.http.get(pr.comments_url + '?access_token=' + this.access_token).map((res: any) => res.json()),
          this.http.get(pr.url + '?access_token=' + this.access_token).map((res: any) => res.json())
        )
          .map((data: any[]) => {
            let pr = data[0];
            let comments = data[1];
            let prDetails = data[2];
            pr.isValid = true;
            if (pr.base.ref != 'develop') {
              pr.isValid = false;
              return Observable.of(pr);
            }

            if (isShipIted(comments)) {
              pr.isValid = false;
              return Observable.of(pr);
            }

            var timeInMillis = new Date().getTime() - new Date(pr.created_at).getTime();
            pr.timeSinceCreation = Math.trunc((timeInMillis / 1000) / 60);

            if (pr.timeSinceCreation < this.newCutOffMinutes) {
              pr.isNew = true;
            }

            pr.isMergeable = prDetails.mergeable;
            console.log(prDetails);
            return Observable.of(pr);
          });


      });
  }

  getComments(commentsUrl: string): Observable<Comment[]> {
    return this.http
      .get(commentsUrl + '?access_token=' + this.access_token)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  function isShipIted(comments) {
  var isShipped = false;
  comments.forEach(comment => {
    // console.log(comment.body);
    if (comment.body.includes('ship') || comment.body.includes("🚢")) {
      isShipped = true;
    }
  })

  return isShipped;
}


}



}
