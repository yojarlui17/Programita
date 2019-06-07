import { Component, OnInit } from "@angular/core";
import { PopoverController } from "@ionic/angular";

@Component({
  selector: "app-poplistaservicio",
  templateUrl: "./poplistaservicio.component.html",
  styleUrls: ["./poplistaservicio.component.scss"]
})
export class PoplistaservicioComponent implements OnInit {
  servicios = Array(40);

  constructor(private popoverController: PopoverController) {}

  ngOnInit() {}

  onClick(v: number) {
    console.log("servicio: ", v);
    this.popoverController.dismiss({
      servicio: v
    });
  }
}
