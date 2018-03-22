import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import Proj4 from 'proj4'
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import {PoliceApiService} from "../police-api.service";
import {MapReprojectionService} from "../map-reprojection-service";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private geolocation: Geolocation, private policeApiService: PoliceApiService, private mapRepoService: MapReprojectionService) {
    const coordsToStateFeet = "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";
    console.log(Proj4(coordsToStateFeet, 'EPSG:4326', [1167466, 1931013]));
    console.log(this.mapRepoService.convertCoordinatesToSurveyFeet( 41.96625362067188, -87.65963856287259))
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  async loadMap() {
    const location: Geoposition = await this.geolocation.getCurrentPosition();
    const myCoordinates: Coordinates = location.coords;

    const crimes = await this.policeApiService.getCrimesNearLocation( 41.96625362067188, -87.65963856287259);
    console.log(crimes);

    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: myCoordinates.latitude,
          lng: myCoordinates.longitude
        },
        zoom: 18,
        tilt: 30
      }
    };

    const map: GoogleMap = GoogleMaps.create('map-canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    await map.one(GoogleMapsEvent.MAP_READY);
    console.log('Map is ready!');

    crimes.forEach(crime => {
      map.addMarker({
        title: crime.iucrDescription,
        icon: 'red',
        animation: 'DROP',
        position: {
          lat: crime.coords.latitude,
          lng: crime.coords.longitude
        }
      });
    });
  }
}
