import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {IStop, TripService} from '../services/trip.service';

@Component({
  selector: 'app-timeline-container',
  templateUrl: './timeline-container.component.html',
  styleUrls: ['./timeline-container.component.css']
})
export class TimelineContainerComponent implements OnInit, AfterViewInit {
  stops: IStop[];

  constructor(public tripService: TripService,
              private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.tripService.trip.subscribe(trip => {
      this.stops = trip;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngAfterViewInit() {
  }
}
