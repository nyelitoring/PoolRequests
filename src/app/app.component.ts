import { Component } from '@angular/core';
import { GithubServiceService } from "app/github-service.service";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/interval';
import { interval } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Pull Party';
  pullRequests = new Array();
  selectedRepo = 'ring-android';
  service;
  retrievalInProgress = true;
  cutoffHours = 48;
  refreshMinutes = 5;
  sub;
  pollSub;
  lastUpdatedTimestamp;

  constructor(private githubService: GithubServiceService) {
    this.service = githubService;
    this.retrievePullRequests();
    this.pollForRequests();
  }

  retrievePullRequests() {
    if (this.sub) {
      this.sub.unsubscribe();
    }

    this.retrievalInProgress = true;
    this.pullRequests.length = 0;
    this.sub = this.service.getPullRequests(this.selectedRepo)
      .flatMap(pr => pr)
      .subscribe(pr => {
        this.retrievalInProgress = false;
        if (pr != undefined) {
          this.pullRequests.push(pr);
          this.lastUpdatedTimestamp = new Date();
        }
      });
  }

  pollForRequests() {
    this.retrievePullRequests();

    if(this.pollSub){
      this.pollSub.unsubscribe();
    }
    this.pollSub = Observable.interval(this.refreshMinutes * 60 * 1000).subscribe(x => {
      this.retrievePullRequests();

    });
  }

  cardBackground(pr): Object {
    if (pr.timeSinceCreation > this.cutoffHours * 60) {
      return { 'background-color': 'hsl(0, 100%, 50%)' }
    }

    var brightness = 100 - (pr.timeSinceCreation / 50);
    return { 'background-color': 'hsl(25, 100%,' + brightness + '%)' }
  }
}
