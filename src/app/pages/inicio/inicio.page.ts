import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform, PopoverController, AlertController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { PoplistaservicioComponent } from "../../components/poplistaservicio/poplistaservicio.component";
/* import { filter } from "rxjs/operators"; */
import { DriverServiceService } from "../../services/driverService/driver-service.service";
import { randomBytes } from "crypto";
import { DatePipe } from "@angular/common";
declare var google;
//
// Author: Yojar Ruiz Rey
//
@Component({
  selector: "app-inicio",
  templateUrl: "inicio.page.html",
  styleUrls: ["inicio.page.scss"]
})
export class InicioPage implements OnInit {
  adicional: any;
  idestado: any;
  aire: boolean;
  peaje: boolean;
  idservicio: any;
  idconductor: any;
  idauto: any;
  tipoauto: any;
  fecservicio: any;
  /* servicio: any;
  servicio3: any; */
  servicio2: any;
  p: number = 0;
  i: any;
  driver: any;
  lat: number = -12.04318;
  lng: number = -77.02824;
  @ViewChild("map") mapElement: ElementRef;
  map: google.maps.Map;
  image: any;
  public serviciopendiente: any;
  estadoAlerta: number = 0;
  estadoConductor: any = "A";
  marker: google.maps.Marker;
  constructor(
    private geolocation: Geolocation,
    private plt: Platform,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private datepipe: DatePipe,
    private driverServiceService: DriverServiceService,
    private activatedRoute: ActivatedRoute /* ,
    public filter: filter */
  ) {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.driver = params["params"];
    });
    this.getLocation();
    this.image = {
      url: "../../../assets/google-maps/auto.png"
    };
    /* this.map.setCenter(new google.maps.LatLng(this.lat, this.lng)); */

    setInterval(() => {
      this.marker.setMap(null);
      this.getLocation();
    }, 200);
  }

  ngOnInit() {
    /* this.activatedRoute.queryParams.filter(params => params.driver)
      .subscribe(params => {
        console.log(params);
        this.driver = params.driver;
        console.log(this.driver);
      }); */
    /* console.log("hep", this.driver); */
    /* this.tarifaFinal(); */
    /* this.enfoque(); */
    /* this.recuperarServicio(); */
    /* this.mostrarServicio();
    this.listService(); */
    /* this.tarifaFinal(); */
  }

  /*  /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////// */
  //METODO LISTAR SERVICIO{
  async listarServices(event) {
    const popover = await this.popoverController.create({
      component: PoplistaservicioComponent,
      event,
      mode: "ios",
      backdropDismiss: false
    });
    await popover.present();
    //ESTE ESPERA A QUE EL POP SE CIERRE PARA FUNCIONAR
    /* const { data } = await popover.onDidDismiss(); */

    //ESTE FUNCIONA DE INMEDIATO
    const { data } = await popover.onWillDismiss();
    this.servicio2 = data;
    console.log("Padre: SERVICIO2", this.servicio2);
    this.aceptarservicio();
    /* this.aceptarservicio();
    console.log(this.aceptarservicio()); */
  }
  async llenarAdicional(event) {
    const popover = await this.popoverController.create({
      component: PoplistaservicioComponent,
      event,
      mode: "ios",
      backdropDismiss: false
    });

    await popover.present();
    //ESTE ESPERA A QUE EL POP SE CIERRE PARA FUNCIONAR
    /* const { data } = await popover.onDidDismiss(); */

    //ESTE FUNCIONA DE INMEDIATO
    const { data } = await popover.onWillDismiss();
    this.servicio2 = data;
    console.log("Padre: ", data);
    /* this.aceptarservicio();
    console.log(this.aceptarservicio()); */
  }

  async add() {
    const alert = await this.alertController.create({
      header: "Adicionales",
      inputs: [
        {
          name: "checkbox1",
          type: "checkbox",
          label: "Aire Acondicionado",
          value: "0",
          checked: false
        },
        {
          name: "checkbox2",
          type: "checkbox",
          label: "Peaje",
          value: "1",
          checked: false
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Ok",
          handler: () => {
            this.tarifaFinal();
            console.log("Confirm Ok");
          }
        }
      ]
    });
    await alert.present();
    this.adicional = await alert.onWillDismiss();
    console.log(this.adicional);
  }

  //FIN DE METODOS}
  enfoque() {
    this.map.setCenter(this.marker.getPosition());
  }
  aceptarservicio() {
    this.idservicio = this.servicio2.servicio.id;
    this.idconductor = parseInt(this.driver.id);
    this.idauto = parseInt(this.driver.id_auto);
    this.tipoauto = parseInt(this.driver.tipo_auto);
    this.fecservicio = this.datepipe.transform(
      Date.now(),
      "yyyy-MM-dd hh:mm:ss"
    );
    let data = {
      id: this.idservicio,
      id_conductor: this.idconductor,
      id_auto: this.idauto,
      tipo_auto: this.tipoauto,
      fecha_servicio: this.fecservicio
    };
    console.log("SE ENVIAN ESTOS DATOS:", data);
    this.driverServiceService.acceptService(data).subscribe();
    this.ini();
  }
  empezarCarrera() {
    console.log("ESTADO EN NUMERO: ", this.servicio2.id_estado);
    if (this.servicio2.id_estado === 3) {
      console.log("SE INICIA CON LA RUTA ESTADO3");
      this.AceptInRuta();
    } else {
      console.log("AUN NO ACEPTA EL CLIENTE");
    }
  }
  ini() {
    this.i = setInterval(() => {
      this.recuperarServicio();
    }, 3000);
  }
  recuperarServicio() {
    console.log("ESTADO ANTES DEL IF:", this.servicio2);
    let d = {
      id: this.idservicio
    }; /* this.idservicio */
    console.log("DATOS PARA RECUPERAR SERVICIO", d);
    this.driverServiceService.recoverService(d).subscribe(res => {
      this.servicio2 = res;
      console.log("ESTADO ES: ", this.servicio2);
      if (
        this.servicio2.id_estado < 3 ||
        this.servicio2.id_estado === undefined
      ) {
        console.log(" NO SE CONFIRMA");
      } else {
        console.log("SE RECUPERA");
        this.mRecSer();
      }
    });
  }
  async mRecSer() {
    clearInterval(this.i);
    const alert = await this.alertController.create({
      header: "Servicio Recuperado",
      message: `Se recupero el Siguiente servicio:${this.servicio2.id}`,
      buttons: [
        {
          text: "ACEPTAR",
          handler: () => {
            this.empezarCarrera();
          }
        }
      ]
    });
    await alert.present();
    console.log("SE TIENE ESTE SERVICIO", this.servicio2.id);
  }
  async AceptInRuta() {
    const alert = await this.alertController.create({
      header: "ATENCION!",
      message: `Empezar el estado "EN RUTA"
         Lugar de destino: ${this.servicio2.direccionDestino}`,
      buttons: [
        {
          text: "Aceptar",
          handler: () => {
            console.log("INICIADO RUTA PARA", this.servicio2.usuario.nombre);
            this.enRuta();
          }
        }
      ]
    });
    await alert.present();
  }
  enRuta() {
    this.idservicio = this.servicio2.id;
    let data = {
      id: this.idservicio
    };
    this.driverServiceService.onRoute(data).subscribe();
    console.log("RUTA ACTIVADA");
    this.p = 5;
  }
  funciona() {
    console.log("FUNCIONA!");
  }
  terminar() {
    this.idservicio = this.servicio2.id;
    let data = {
      id: this.idservicio
    };
    this.driverServiceService.finishService(data).subscribe();
    this.adicionales();
  }
  async adicionales() {
    await this.add();
    if (this.adicional.data.values[0] === "0") {
      this.aire = true;
    } else {
      this.aire = false;
    }
    if (
      this.adicional.data.values[1] === "1" ||
      this.adicional.data.values[0] === "1"
    ) {
      this.peaje = true;
    } else {
      this.peaje = false;
    }
    this.idservicio = this.servicio2.id;
    let d = {
      id: this.idservicio,
      _aire: this.aire,
      _peaje: this.peaje
    };
    console.log(d);
    this.driverServiceService.additional(d).subscribe();
    this.tarifaFinal();
  }

  tarifaFinal() {
    let d = {
      id: this.idservicio
    }; /* this.idservicio */
    console.log(d);
    this.driverServiceService.finalRate(d).subscribe(res => {
      console.log("PRECIO FINAL", res);
      this.mtarfin(res);
    });
    /* console.log(
      "tarifa final",api/servicio/recuperar_usuario
      this.driverServiceService.finalRate().subscribe()
    ); */
  }
  async mtarfin(p) {
    const alert = await this.alertController.create({
      header: "Tarifa Total",
      message: `La tarifa total del viaje es: S/. ${p}`,
      buttons: ["ACEPTAR"]
    });
    await alert.present();
  }

  //
  mostrarServicio() {
    console.log("estadoServicio", this.serviciopendiente.id_estado);
    this.idestado = this.serviciopendiente.id_estado;
    if (this.idestado == 1 && this.estadoAlerta == 0) {
      console.log("si entre");
      this.alertController.create({
        header: "Hola, " + this.driver.nombre,
        message: "Hay un servicio de S/." + this.serviciopendiente.totalTarifa,
        buttons: [
          {
            text: "OK",
            role: "ok",
            handler: () => {
              console.log("Id Servicio: ", this.serviciopendiente.id);
              this.estadoAlerta = 1;
              clearInterval(this.i);
              this.estadoAlerta = 1;
              this.estadoConductor = "B";
              console.log(this.estadoConductor);
              this.aceptarservicio();
            }
          }
        ]
      });
    } else {
      console.log("estamos tan cerca... pero tan lejos");
    }
  }
  listService() {
    this.driverServiceService
      .getlistOfPendingServices()
      .subscribe(resultado => {
        this.serviciopendiente = resultado[0];
        console.log("Resultado_verServicio", this.serviciopendiente);
        if (this.serviciopendiente.id_servicio == 0) {
          console.log("No hay carreras");
        } else {
          console.log("Hay carreras.");
          console.log("Carreras: ", this.serviciopendiente);
          this.mostrarServicio();
        }
      });
  }
  selectServicio(elemento) {
    console.log("seleccionado", elemento);
    this.servicio2 = elemento;
    this.popoverController.dismiss({
      servicio: this.servicio2
    });
  }
  getLocation() {
    /* console.log("hola :3"); */
    this.geolocation
      .getCurrentPosition({
        maximumAge: 1000,
        timeout: 5000,
        enableHighAccuracy: true
      })
      .then(
        resp => {
          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
          /* console.log(this.lat, this.lng); */
        },
        er => {
          console.log("ERROR", er);
        }
      )
      .catch(error => {
        console.log("ERROR", error);
      });
    this.marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      icon: this.image
    });
  }
  ionViewDidEnter() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: this.lat, lng: this.lng },
      zoom: 15,
      mapTypeControl: false,
      zoomControl: false,
      scaleControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP /* INICIO DEL STYLE */
      /* styles:
       [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
        {
          featureType: "administrative.land_parcel",
          elementType: "labels.text.fill",
          stylers: [{ color: "#bdbdbd" }]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }]
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dadada" }]
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#616161" }]
        },
        {
          featureType: "road.local",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        },
        {
          featureType: "transit.line",
          elementType: "geometry",
          stylers: [{ color: "#e5e5e5" }]
        },
        {
          featureType: "transit.station",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }]
        }
      ] 
      */
    });
  }
}
