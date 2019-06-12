import { Component, OnInit } from "@angular/core";
import { PopoverController, AlertController } from "@ionic/angular";
import { DriverServiceService } from "../../services/driverService/driver-service.service";

@Component({
  selector: "app-poplistaservicio",
  templateUrl: "./poplistaservicio.component.html",
  styleUrls: ["./poplistaservicio.component.scss"]
})
export class PoplistaservicioComponent implements OnInit {
  servicio: any;
  public serviciopendiente: any;
  idservicio: any;
  estadoAlerta: number = 0;

  constructor(
    private popoverController: PopoverController,
    public driverServiceService: DriverServiceService,
    public alertController: AlertController
  ) {}

  ngOnInit() {
    console.warn("estoy adentro ");
    this.listService();
  }

  /* onClick(v: number) {
    console.log("servicio: ", v);
    this.popoverController.dismiss({
      servicio: v
    });
  } */

  listService() {
    this.driverServiceService
      .getlistOfPendingServices()
      .subscribe(resultado => {
        this.serviciopendiente = resultado;
        console.log("Resultado_verServicio", this.serviciopendiente);
        if (this.serviciopendiente.id_servicio == 0) {
          console.log("No hay carreras");
        } else {
          console.log("Hay carreras.");
          console.log("Carreras: ", this.serviciopendiente);
        }
      });
  }
  selectServicio(elemento) {
    console.log("seleccionado", elemento);
    this.servicio = elemento;
    this.popoverController.dismiss({
      servicio: this.servicio
    });
  }
  mostrarServicio() {
    console.log("estadoServicio", this.serviciopendiente.estado);
    if (this.serviciopendiente.estado == 1 && this.estadoAlerta == 0) {
      this.alertController.create({
        header: "Hola, Leonardo ",
        message: "Hay una servicio de S/." + this.serviciopendiente.precio,
        buttons: [
          {
            text: "Cancelar",
            handler: data => {
              this.estadoAlerta = 1;
              /* this.cancelarServicio(); */
            }
          },
          {
            text: "Aceptar",
            handler: data => {
              this.estadoAlerta = 1;
              this.idservicio = this.servicio.id_servicio;
              console.log(this.idservicio);
            }
          }
        ]
      });
      this.estadoAlerta = 1;
    }
  }
  async mensaje(h: string, t: string) {
    const alert = await this.alertController.create({
      header: h,
      message: t,
      buttons: ["OK"]
    });
    await alert.present();
  }
}
