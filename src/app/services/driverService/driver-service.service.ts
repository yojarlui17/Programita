import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";

@Injectable({
  providedIn: "root"
})
export class DriverServiceService {
  constructor(private data: DataconectionService) {}
  listOfPendingServices() {
    return this.data.get("api/servicio/ListaPendientes");
  }
  /* acceptService() {
    return this.data.post("api/servicio/aceptar");
  }
  finishService() {
    return this.data.post("api/servicio/terminar");
  }
  additional() {
    return this.data.post("api/servicio/adicional");
  }
  newRate() {
    return this.data.get("api/servicio/tarifa_final");
  } */
}
