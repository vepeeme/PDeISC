import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'simon',
    loadComponent: () => import('./juegos/simon/simon.page').then(m => m.SimonPage)
  },
  {
    path: 'piedra-papel-tijeras',
    loadComponent: () => import('./juegos/piedra-papel-tijeras/piedra-papel-tijeras.page').then(m => m.PiedraPapelTijerasPage)
  },
  {
    path: 'tateti',
    loadComponent: () => import('./juegos/tateti/tateti.page').then(m => m.TatetiPage)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }