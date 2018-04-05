import { Component } from '@angular/core';
import { GithubServiceService } from "app/github-service.service";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Pull Party';
  pullRequests = new Array();
  service: GithubServiceService;

  constructor(private githubService: GithubServiceService) {

    this.service = githubService;
    githubService.getAndroidPulls()
      .flatMap(pr => pr)
      .subscribe(pr => {
        if (pr != undefined) {
          this.pullRequests.push(pr);
        }

      });
  }
}
