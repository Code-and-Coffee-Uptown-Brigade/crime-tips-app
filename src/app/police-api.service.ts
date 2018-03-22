import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MapReprojectionService} from "./map-reprojection-service";
import {Crime} from "./home/crime.model";

@Injectable()
export class PoliceApiService {
  private readonly baseUrl = 'http://api1.chicagopolice.org/clearpath/api/1.0';

  constructor(private httpClient: HttpClient, private mapReprojectionService: MapReprojectionService) {}

  async getCrimesNearLocation(latitude, longitude) {
    const { x, y } = this.mapReprojectionService.convertCoordinatesToSurveyFeet(latitude, longitude);
    const results = await this.httpClient.get<Crime[]>(`${this.baseUrl}/crimes/nearbyXY?x=${Math.round(x)}&y=${Math.round(y)}`).toPromise();
    results.forEach(result => {
      result.coords = this.mapReprojectionService.convertSurveyFeetToCoordinates(result.xCoordinate, result.yCoordinate);
    });
    return results;
  }

  getCalendarEvents() {
    return this.httpClient.get(`${this.baseUrl}/communityCalendar/events`);
  }
}
