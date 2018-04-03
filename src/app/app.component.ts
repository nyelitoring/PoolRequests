import { Component } from '@angular/core';
import {GithubServiceService} from "app/github-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pool Requests';
  pullRequestsResponse;


  constructor(private githubService: GithubServiceService) {

      this.pullRequestsResponse = githubService.getAndroidPulls();
   }
}
