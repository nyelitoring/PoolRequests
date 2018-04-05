import { Component } from '@angular/core';
import { GithubServiceService } from "app/github-service.service";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/take';
import { MatCardModule } from '@angular/material/card';
import {Observable} from 'rxjs/Observable';
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
  service: GithubServiceService;

  constructor(private githubService: GithubServiceService) {

    this.service = githubService;
    githubService.getPullRequests('ring-android')
      .flatMap(pr => pr)
      .subscribe(pr => {
        if (pr != undefined) {
          this.pullRequests.push(pr);
        }
      });
  }

  cardBackground(pr): Object {
       if(pr.timeSinceCreation > 1440){
           return {'background-color': 'hsl(0, 100%, 50%)'}
       }

       var brightness = 100 - (pr.timeSinceCreation / 50);
       return {'background-color': 'hsl(25, 100%,' + brightness +'%)'}
   }
}
