import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { LrcComponent } from './lrc/lrc.component';

const routes: Routes = [
  // {
  //   path: 'home',
  //   component: LrcComponent,
  // },
  // {
  //   path: 'list',
  //   component: ListComponent,
  // },
  // { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
