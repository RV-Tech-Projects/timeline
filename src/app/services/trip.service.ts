import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {take} from 'rxjs/operators';

export interface IStop {
  name: string;
  id: string;
  type?: string;
  places?: { name: string, type: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  trip = new BehaviorSubject<IStop[]>([]);

  constructor() {
    let count = 1;

    this.trip.next([
      { name: 'Some Source', id: `${count++}`, type: 'source', places: [
          { name: 'Hypercity', type: 'hotel' },
        ]},
      { name: 'Mumbai', id: `${count++}`, places: [
          { name: 'Inorbit', type: 'hotel' },
          { name: 'Essel World', type: 'attraction' },
          { name: 'Hypercity', type: 'hotel' },
          { name: 'Filmcity', type: 'attraction' },
        ] },
      { name: 'Bholenath', id: `${count++}`, places: [
          { name: 'Hypercity', type: 'hotel' },
          { name: 'Filmcity', type: 'attraction' },
        ]},
      { name: 'Some Destination', id: `${count++}`, type: 'destination', places: [
          { name: 'Hypercity', type: 'hotel' },
        ]},
    ]);
    console.log(`${count - 1} number of stops (including source and destination)`);
  }

  removeStop(id: string) {
    const tempTrip: IStop[] = [];

    this.trip.pipe(take(1)).subscribe(trip => {
      trip.forEach(stop => {
        if (stop.id !== id) {
          tempTrip.push(stop);
        }
      });

      this.trip.next(tempTrip);
    });
  }

  editStop(stopToBeEdited: IStop) {
    this.trip.pipe(take(1)).subscribe(trip => {
      trip.forEach(stop => {
        if (stop.id === stopToBeEdited.id) {
          stop.name = 'Edited: ' + Math.floor(Math.random() * 100);
        }
      });

      this.trip.next(trip);
    });
  }
}
