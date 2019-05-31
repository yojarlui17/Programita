import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "logeo",
    pathMatch: "full"
  },
  {
    path: "inicio",
    loadChildren: "./pages/inicio/inicio.module#InicioPageModule"
  },
  {
    path: "list",
    loadChildren: "./list/list.module#ListPageModule"
  },
  {
    path: "configuracion",
    loadChildren:
      "./pages/configuracion/configuracion.module#ConfiguracionPageModule"
  },
  { path: "logeo", loadChildren: "./pages/logeo/logeo.module#LogeoPageModule" },
  {
    path: "tusviajes",
    loadChildren: "./pages/tusviajes/tusviajes.module#TusviajesPageModule"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
