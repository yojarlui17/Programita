import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PoplistaservicioComponent } from "./poplistaservicio/poplistaservicio.component";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [PoplistaservicioComponent],
  exports: [PoplistaservicioComponent],
  imports: [CommonModule, IonicModule]
})
export class ComponentsModule {}
