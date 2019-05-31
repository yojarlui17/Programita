import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

const rutaAPI = "http://desarrollo.cdiproject.com:70/remix/";
let headers: HttpHeaders = new HttpHeaders();
headers = headers.append("Accept", "application/json");
@Injectable({
  providedIn: "root"
})
export class DataconectionService {
  constructor(private httpClient: HttpClient) {}

  get(ruta) {
    return this.httpClient.get(rutaAPI + ruta, { headers });
  }
  post(ruta, body) {
    return this.httpClient.post(rutaAPI + ruta, body, { headers });
  }
}
