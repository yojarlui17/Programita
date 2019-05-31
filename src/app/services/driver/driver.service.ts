import { Injectable } from "@angular/core";
import { DataconectionService } from "../conection/dataconection.service";

@Injectable({
  providedIn: "root"
})
export class DriverService {
  constructor(private data: DataconectionService) {}

  login(data) {
    return this.data.post("api/conductor/login", data);
  }
  validateShift(data) {
    return this.data.post("api/conductor/turno", data);
  }
}
