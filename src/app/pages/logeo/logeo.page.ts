import { Component, OnInit } from "@angular/core";
import { DriverService } from "../../services/driver/driver.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { identifierModuleUrl } from "@angular/compiler";

@Component({
  selector: "app-logeo",
  templateUrl: "./logeo.page.html"
})
export class LogeoPage implements OnInit {
  id: string;
  pass: string;
  conductor: any;
  inesable = true;
  loading = false;

  constructor(
    private driver: DriverService,
    public datepipe: DatePipe,
    private router: Router,
    private alertController: AlertController
  ) {}

  login() {
    this.loading = true;
    let cuenta = {
      correo: this.id,
      clave: this.pass
    };
    this.driver.login(cuenta).subscribe(r => {
      this.conductor = r;
      console.log(this.conductor);
      if (this.conductor["nombre_completo"] != " ") {
        console.log("ok");
        this.validarTurno();
      } else {
        this.mensaje(
          "Error de Autenticacion",
          "Contraseña y/o correo son invalidos"
        );
        this.loading = false;
        console.log("atras");
      }
    });
  }
  goConductor() {
    this.router.navigate(["/inicio"], { queryParams: this.conductor });
  }
  validarTurno() {
    let horario = {
      date: this.datepipe.transform(Date.now(), "yyyy-MM-dd hh:mm:ss"),
      id_conductor: this.conductor.id
    };
    this.driver.validateShift(horario).subscribe(r => {
      let h;
      h = r;
      console.log(h);
      console.log(horario);
      if (h == true) {
        console.log("adelante");
        this.goConductor();
      } else {
        this.mensaje("Fuera de Turno", " Usted se encuentra fuera de turno");
        this.loading = false;
        console.log("a dormir");
      }
    });
  }

  ngOnInit() {}
  async mensaje(h: string, t: string) {
    const alert = await this.alertController.create({
      header: h,
      message: t,
      buttons: ["OK"]
    });
    await alert.present();
  }
}
