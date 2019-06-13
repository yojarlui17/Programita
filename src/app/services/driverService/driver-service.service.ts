import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DriverServiceService {
  constructor(private data: DataconectionService) {}
  getlistOfPendingServices() {
    return this.data.get("api/servicio/ListaPendientes");
  }
  acceptService(datita) {
    return this.data.post("api/servicio/aceptar", datita);
  }
  onRoute(datita) {
    return this.data.post("api/servicio/enruta", datita);
  }
  finishService(datita) {
    return this.data.post("api/servicio/terminar", datita);
  }
  additional(datita) {
    return this.data.post("api/servicio/adicional", datita);
  }
  finalRate(datita) {
    return this.data.post("api/servicio/tarifa_final", datita);
  }
  recoverService(datita) {
    return this.data.post("api/servicio/recuperar", datita);
  }
}
