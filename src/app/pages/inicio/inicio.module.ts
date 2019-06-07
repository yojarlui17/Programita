import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { InicioPage } from "./inicio.page";
import { PoplistaservicioComponent } from "src/app/components/poplistaservicio/poplistaservicio.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  entryComponents: [PoplistaservicioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: InicioPage
      }
    ])
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
