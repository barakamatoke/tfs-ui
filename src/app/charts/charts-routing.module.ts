import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartistComponent } from "./chartist/chartist.component";
import { ChartjsComponent } from "./chartjs/chartjs.component";
import { NGXChartsComponent } from "./ngx-charts/ngx-charts.component";
import { ApexComponent } from './apex/apex.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'chartist',
        component: ChartistComponent,
        data: {
          title: 'Chartist'
        }
      },
      {
        path: 'chartjs',
        component: ChartjsComponent,
        data: {
          title: 'Chartjs'
        }
      },
      {
        path: 'ngx',
        component: NGXChartsComponent,
        data: {
          title: 'NGX Charts'
        }
      },
      {
        path: 'apex',
        component: ApexComponent,
        data: {
          title: 'Apex Charts'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule { }
