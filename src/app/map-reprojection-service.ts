import {Injectable} from "@angular/core";
import {Coordinates} from "@ionic-native/geolocation";
declare var proj4;

@Injectable()
export class MapReprojectionService {
  private illinoisSurveyFeetProjection = "+proj=tmerc +lat_0=36.66666666666666 +lon_0=-88.33333333333333 +k=0.9999749999999999 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs";

  constructor() {
    console.log(proj4);
    console.log(proj4(this.illinoisSurveyFeetProjection, 'EPSG:4326', [1167466, 1931013]));
  }

  convertSurveyFeetToCoordinates(feetX, feetY): Coordinates {
    const [long, lat] = proj4(this.illinoisSurveyFeetProjection, 'EPSG:4326', [feetX, feetY]);
    const coordinates: any = {};
    coordinates.latitude = lat;
    coordinates.longitude = long;
    return coordinates;
  }

  convertCoordinatesToSurveyFeet(latitude, longitude) {
    const [x, y] = proj4('EPSG:4326', this.illinoisSurveyFeetProjection, [longitude, latitude]);
    return { x, y };
  }
}
