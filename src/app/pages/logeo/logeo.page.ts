import { Component, OnInit } from "@angular/core";
import { DriverService } from "../../services/driver/driver.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-logeo",
  templateUrl: "./logeo.page.html"
})
export class LogeoPage implements OnInit {
  id: string;
  pass: string;
  conductor: any;

  constructor(
    private driver: DriverService,
    public datepipe: DatePipe,
    private router: Router
  ) {}

  login() {
    let cuenta = {
      correo: this.id,
      clave: this.pass
    };
    this.driver.login(cuenta).subscribe(r => {
      this.conductor = r;
      console.log(this.conductor);
      if (this.conductor["nombre_completo"] != null) {
        console.log("ok");
        this.validarTurno();
      } else {
        console.log("atras papu");
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
        console.log("adelante papu");
        this.goConductor();
      } else {
        console.log("a dormir papu");
      }
    });
  }

  ngOnInit() {}
}
