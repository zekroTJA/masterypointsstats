/** @format */

import { Component, OnInit, Inject } from '@angular/core';
import { SummonerModel } from 'src/app/models/summoner.model';
import { StateService } from 'src/app/services/state/state.service';
import { IAPIService } from 'src/app/services/api/api.interface';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';
import { LoadingBarService } from 'src/app/services/loading-bar/loading-bar.service';

@Component({
  selector: 'app-main-route',
  templateUrl: './main-route.component.html',
  styleUrls: ['./main-route.component.scss'],
})
export class MainRouteComponent {
  constructor(
    public state: StateService,
    @Inject('APIService') private api: IAPIService,
    private notifications: NotificationService,
    private router: Router,
    private loadingBar: LoadingBarService
  ) {}

  public onSearch(value: string) {
    if (!value) {
      return;
    }

    this.loadingBar.activate();
    this.api
      .getSummoner(this.state.server, value)
      .toPromise()
      .then((summoner) => {
        console.log(summoner);
        this.state.currentSummoner = summoner;
        this.router.navigate(['summoner', summoner.name]);
      })
      .catch((err) => {
        if (err.status === 404) {
          this.notifications.show(
            `This summoner could not be found on ${this.state.server}!`,
            'error'
          );
        }
      })
      .finally(() => {
        this.loadingBar.deactivate();
      });
  }
}
