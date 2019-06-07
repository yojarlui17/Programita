import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Platform, PopoverController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { PoplistaservicioComponent } from "../../components/poplistaservicio/poplistaservicio.component";
import { isDefaultChangeDetectionStrategy } from "@angular/core/src/change_detection/constants";

/* import { filter } from "rxjs/operators"; */
declare var google;
@Component({
  selector: "app-inicio",
  templateUrl: "inicio.page.html",
  styleUrls: ["inicio.page.scss"]
})
export class InicioPage implements OnInit {
  idservicio: any;
  idconductor: any;
  idauto: any;
  tipoauto: any;
  fecservicio: any;
  lat: number = 0;
  driver: any;
  lng: number = 0;
  @ViewChild("map") mapElement: ElementRef;
  map: google.maps.Map;
  image: any;
  marker: google.maps.Marker;
  constructor(
    private geolocation: Geolocation,
    private plt: Platform,
    public popoverController: PopoverController,
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
    console.log("hep", this.driver);
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
    console.log("Padre: ", data);
  }

  //FIN DE METODOS}
  enfoque() {
    this.map.setCenter(this.marker.getPosition());
  }
  aceptarservicio() {
    /* this.idservicio= ;
    this.idconductor= ;
    this.idauto= ;
    this.tipoauto= ;
    this.fecservicio= ; */
    let data = {
      id_servicio: "",
      id_conductor: "44",
      id_auto: "35",
      tipo_auto: "2",
      fecha_servicio: ""
    };
    this.driver.acceptService(data).suscribe();
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
