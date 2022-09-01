import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublisherPage } from './publisher.page';

const routes: Routes = [
  {
    path: '',
    component: PublisherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublisherPageRoutingModule {}
