import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform, PopoverController, AlertController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { PoplistaservicioComponent } from "../../components/poplistaservicio/poplistaservicio.component";
/* import { filter } from "rxjs/operators"; */
import { DriverServiceService } from "../../services/driverService/driver-service.service";
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
  servicio: any;
  servicio3: any;
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
    this.listService();
    this.ini();
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
    this.servicio = data;
    console.log("Padre: ", data);
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
    this.servicio = data;
    console.log("Padre: ", data);
    /* this.aceptarservicio();
    console.log(this.aceptarservicio()); */
  }

  ini() {
    this.i = setInterval(() => {
      this.mostrarServicio();
    }, 5000);
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
    this.idservicio = this.servicio.id;
    this.idconductor = this.driver.id;
    this.idauto = this.driver.id_auto;
    this.tipoauto = this.driver.tipo_auto;
    this.fecservicio = this.servicio.fecha_servicio;
    let data = {
      id: this.idservicio,
      id_conductor: this.idconductor,
      id_auto: this.idauto,
      tipo_auto: this.tipoauto,
      fecha_servicio: this.fecservicio
    };
    this.driver.acceptService(data).suscribe();
  }
  enRuta() {
    this.idservicio = this.servicio.id;
    let data = {
      id: this.idservicio
    };
    this.driver.onRoute(data).suscribe();
  }
  terminar() {
    this.idservicio = this.servicio.id;
    let data = {
      id: this.idservicio
    };
    this.driver.finishService(data).suscribe();
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
    this.idservicio = this.servicio.id;
    let d = {
      id: this.idservicio,
      aire: this.aire,
      peaje: this.peaje
    };
    console.log(d);
    this.driver.onRoute(d).suscribe();
  }

  tarifaFinal() {
    let d = {
      id: 22
    }; /* this.idservicio */
    console.log(d);
    this.driverServiceService.finalRate(d).subscribe(res => {
      console.log(res);
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
  recuperarServicio() {
    let d = {
      id: 16
    };
    console.log(d);
    this.driverServiceService.recoverService(d).subscribe(res => {
      this.servicio3 = res;
      console.log(this.servicio3);
      this.mRecSer(res);
    });
  }
  async mRecSer(p) {
    const alert = await this.alertController.create({
      header: "Servicio Recuperado",
      message: `Se recupero el Siguiente servicio:${p}`,
      buttons: ["ACEPTAR"]
    });
    await alert.present();
  }
  //
  async message(h: string, m: string, b: any, tb: any, metodo: any, call: any) {
    b = {
      text: tb,
      handler: data => {
        metodo;
      }
    };
    const alert = await this.alertController.create({
      header: h,
      message: m,
      buttons: [b]
    });
    await alert.present();
    call;
  }
  mostrarServicio() {
    console.log("estadoServicio", this.serviciopendiente.id_estado);
    this.idestado = this.serviciopendiente.id_estado;
    if (this.idestado == 1 && this.estadoAlerta == 0) {
      console.log("si entre");

      this.message(
        `Hola, ${this.driver.nombre}`,
        `Hay un servicio de S/. ${this.serviciopendiente.totalTarifa}`,
        "OK",
        "OK",
        `${console.log(
          "Id Servicio: ",
          this.serviciopendiente.id
        )};${(this.estadoAlerta = 1)};${clearInterval(this.i)};`,
        `${(this.estadoAlerta = 1)};${(this.estadoConductor =
          "B")};${console.log(this.estadoConductor)};`
      );
      /* this.alertController.create({
        header: `Hola, ${this.driver.nombre} `,
        message: "Hay una servicio de S/." + this.serviciopendiente.precio,
        buttons: [
          {
            text: "Cancelar",
            handler: data => {
              this.estadoAlerta = 1;
              //this.cancelarServicio();
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
    } */
    } else {
      console.log("estamos tan cerca... pero tan lejos");
    }
  }
  listService() {
    this.driverServiceService
      .getlistOfPendingServices()
      .subscribe(resultado => {
        this.serviciopendiente = resultado[11];
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
    this.servicio = elemento;
    this.popoverController.dismiss({
      servicio: this.servicio
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
