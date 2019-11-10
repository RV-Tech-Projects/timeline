import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IStop, TripService} from '../services/trip.service';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-stop-adder',
  templateUrl: './stop-adder.component.html',
  styleUrls: ['./stop-adder.component.css']
})
export class StopAdderComponent implements OnInit {
  addStop: FormGroup;
  addPlace: FormGroup;
  trip: IStop[];

  constructor(public tripService: TripService) { }

  ngOnInit() {
    this.addStop = new FormGroup({
      stopName: new FormControl(null, Validators.required)
    });

    this.addPlace = new FormGroup({
      stop: new FormControl(null, Validators.required)
    });

    this.tripService.trip.subscribe(trip => {
      this.trip = trip;
    });
  }

  onAddStopSubmit() {
    if (this.addStop.valid) {
      const destination = this.trip.pop();
      this.trip.push({
        name: this.addStop.value.stopName,
        id: '' + Math.random()
      });
      this.trip.push(destination);

      this.tripService.trip.next(this.trip);
    }
  }

  onAddPlaceSubmit() {
    if (this.addPlace.valid) {
      this.tripService.display = false;

      const newStop = {
        name: 'Some place',
        type: ['hotel', 'attraction'][Math.random() > 0.5 ? 1 : 0]
      };

      if (!this.addPlace.value.stop.places) {
        this.addPlace.value.stop.places = [];
      }
      this.addPlace.value.stop.places.push(newStop);
      this.tripService.trip.next([...this.trip]);

      this.tripService.display = true;

      this.tripService.trip.pipe(take(1)).subscribe((trip: IStop[]) => {
        console.log(trip);
      });
    }
  }
}
