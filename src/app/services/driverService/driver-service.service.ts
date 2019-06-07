import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";

@Injectable({
  providedIn: "root"
})
export class DriverServiceService {
  constructor(private data: DataconectionService) {}
  getlistOfPendingServices() {
    return this.data.get("api/servicio/ListaPendientes");
  }
  acceptService() {
    return this.data.post("api/servicio/aceptar", this.data);
  }
  onRoute() {
    return this.data.post("api/servicio/enruta", this.data);
  }
  finishService() {
    return this.data.post("api/servicio/terminar", this.data);
  }
  additional() {
    return this.data.post("api/servicio/adicional", this.data);
  }
  finalRate() {
    return this.data.get("api/servicio/tarifa_final" + this.data);
  }
  recoverService() {
    return this.data.get("api/servicio/recuperar" + this.data);
  }
}
