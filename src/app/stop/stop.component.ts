import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { HelperCanvas } from './helper-functions';
import {IStop, TripService} from '../services/trip.service';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.css']
})
export class StopComponent implements OnInit, AfterViewInit {
  @Input() stop: IStop;
  @Input() stopType = 'stop';
  @Input() arrivalDate = new Date();
  @Input() departureDate = new Date();

  @ViewChild('stop', { static: false }) canvasTemplate: ElementRef;

  helperCanvas: HelperCanvas;
  canvasElement: HTMLCanvasElement;
  stopLabelYCoordinate = 45;
  placesHeightOffset = 45;
  places: { name: string, type: string }[];
  buttons = {
    deleteHover: false,
    deletePlaces: []
  };
  iconsBaseUrl = 'assets/icons/';
  mapped: {
    width: number,
    height: number
  };

  darkTheme = {
    name: 'dark',
    backgroundColor: 'rgb(0, 0, 0)',
    color: 'rgb(255, 255, 255)',
    stopSeparatorColor: 'rgb(0, 0, 0)',
    dateColor: 'rgb(127, 127, 127)',
    sourceAndDestinationDateBackgroundColor: 'rgb(25, 25, 25)',
    sourceAndDestinationDateBorderColor: 'rgb(20, 20, 20)',
    placesMarkerColor: 'light'
  };

  lightTheme = {
    name: 'light',
    backgroundColor: 'rgb(255, 255, 255)',
    color: 'rgb(0, 0, 0)',
    stopSeparatorColor: 'rgb(255, 255, 255)',
    dateColor: 'rgb(32, 32, 32)',
    sourceAndDestinationDateBackgroundColor: 'rgb(252, 252, 252)',
    sourceAndDestinationDateBorderColor: 'rgb(240, 240, 240)',
    placesMarkerColor: 'dark'
  };

  currentTheme;

  constructor(private tripService: TripService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
    this.currentTheme = this.lightTheme;
  }

  ngOnInit() {
    if (this.stop.type) {
      this.stopType = this.stop.type;
    }

    this.places = this.stop.places ? this.stop.places : [];

    this.places.forEach((item, index) => {
      this.buttons.deletePlaces.push(false);
    });
  }

  editOrRemoveStop() {
    if (this.stopType === 'stop') {
      this.tripService.removeStop(this.stop.id);
    } else {
      this.tripService.editStop(this.stop);
    }
  }

  deletePlace(index: number) {
    this.tripService.deletePlaceFromStop(this.stop.id, index);
  }

  ngAfterViewInit() {
    this.canvasElement = (this.canvasTemplate.nativeElement as HTMLCanvasElement);

    if (this.stop.places) {
      this.canvasElement.height +=
        this.placesHeightOffset * this.stop.places.length;
    }

    this.helperCanvas = new HelperCanvas(this.canvasElement);

    this.mapped = {
      width: this.canvasElement.width / this.helperCanvas.resolution - 1,
      height: this.canvasElement.height / this.helperCanvas.resolution - 1
    };

    this.startRendering();

    this.helperCanvas.drawLine(0, this.mapped.height,
      this.mapped.width, this.mapped.height,
      2, this.currentTheme.stopSeparatorColor);
  }

  startRendering() {
    this.renderBackground();
    this.writeStopLabel();
    this.renderStopMarkerConnectorLine();
    this.renderStopMarker();
    this.renderDates();

    if (this.stop.places) {
      this.renderPlaces();
    }
  }

  renderBackground() {
    this.helperCanvas.drawFilledRect(0, 0,
      this.mapped.width, this.mapped.height,
      this.currentTheme.backgroundColor);
  }

  writeStopLabel() {
    const textWidth =
      this.helperCanvas.canvasContext.measureText(this.stop.name).width;
    const currentFontSize =
      +this.helperCanvas.canvasContext.font.split('px')[0];
    let fontSize = 11;

    const outlineRectWidth = ((fontSize * textWidth) / currentFontSize) + 30;

    if (this.stopType === 'stop') {
      fontSize = 10;
    }

    if (!this.stop.places) {
      this.stopLabelYCoordinate = (this.mapped.height / 2);
    }

    this.helperCanvas.drawFilledRect(
      32, this.stopLabelYCoordinate - 10,
      outlineRectWidth, 20, this.currentTheme.backgroundColor
    );

    // this.helperCanvas.drawOutlineRect(
    //   32, this.stopLabelYCoordinate - 10,
    //   outlineRectWidth, 20, this.currentTheme.color
    // );

    this.helperCanvas.drawRoundedRect(
      32, this.stopLabelYCoordinate - 10,
      outlineRectWidth, 20, 10, this.currentTheme.color
    );

    if (this.stopType === 'stop') {
      this.helperCanvas.writeText(
        this.stop.name, 40, this.stopLabelYCoordinate + 2.5,
        fontSize, this.currentTheme.color,
        'bold ' + fontSize + 'px Courier New'
      );
    } else {
      this.helperCanvas.writeText(
        this.stop.name, 40, this.stopLabelYCoordinate + 2.5,
        fontSize, this.currentTheme.color,
        'bold ' + fontSize + 'px ' + this.helperCanvas.fontFamily
      );
    }

    // this.helperCanvas.drawLine(0, this.mapped.height / 2,
    //   this.mapped.width, this.mapped.height / 2,
    //   2, 'white');
  }

  renderStopMarker() {
    let color = 'grey';
    let radius = 3.5;

    if (['source', 'destination'].indexOf(this.stopType) !== -1) {
      color = this.currentTheme.color;
      radius = 5;
    }

    if (!this.stop.places) {
      this.stopLabelYCoordinate = this.mapped.height / 2;
    }

    this.helperCanvas.drawFilledCircle(
      20, this.stopLabelYCoordinate, radius, color
    );
  }

  renderStopMarkerConnectorLine() {
    if (!this.stop.places) {
      this.stopLabelYCoordinate = this.mapped.height / 2;
    }

    const dashParams = [3, 2];

    if (this.stopType !== 'source') {
      this.helperCanvas.drawDashedLine(
        20, 0, 20,
        this.stopLabelYCoordinate, 1, 'grey',
        dashParams
      );
    }

    if (this.stopType !== 'destination') {
      this.helperCanvas.drawDashedLine(
        20, this.stopLabelYCoordinate, 20,
        this.mapped.height, 1, 'grey',
        dashParams
      );
    }

    // Line connecting the markers of the places
    if (this.stopType === 'destination' &&
        this.places.length > 0) {
      this.helperCanvas.drawDashedLine(
        20, this.stopLabelYCoordinate, 20,
        this.mapped.height - 28, 1, 'grey',
        dashParams
      );
    }
  }

  renderDates() {
    const aDate = this.arrivalDate;
    const dDate = this.departureDate;
    const dateFontSize = 7;
    let dateXCoordinate = 28;

    if (!this.stop.places) {
      this.stopLabelYCoordinate = this.mapped.height / 2;
    }

    if (this.stopType === 'stop') {
      this.helperCanvas.writeText(
        'Arrival: ' + aDate.toLocaleDateString() + ' ' + aDate.toLocaleTimeString(),
        dateXCoordinate, this.stopLabelYCoordinate - 15, dateFontSize, this.currentTheme.dateColor
      );
      this.helperCanvas.writeText(
        'Departure: ' + dDate.toLocaleDateString() + ' ' + dDate.toLocaleTimeString(),
        dateXCoordinate, this.stopLabelYCoordinate + 19, dateFontSize, this.currentTheme.dateColor
      );
      return;
    }

    const displayDate = this.stopType === 'source' ?
      dDate.toLocaleDateString() + ' ' + dDate.toLocaleTimeString() :
      aDate.toLocaleDateString() + ' ' + aDate.toLocaleTimeString();

    dateXCoordinate = this.stop.name.length > 12 ? 170 : 150;

    this.helperCanvas.drawFilledRect(
      dateXCoordinate - 5, this.stopLabelYCoordinate - 8,
      75, 15,
      this.currentTheme.sourceAndDestinationDateBackgroundColor
    );

    this.helperCanvas.drawOutlineRect(
      dateXCoordinate - 5, this.stopLabelYCoordinate - 8,
      75, 15,
      this.currentTheme.sourceAndDestinationDateBorderColor
    );

    this.helperCanvas.writeText(
      displayDate, dateXCoordinate,
      this.stopLabelYCoordinate + 2, dateFontSize, this.currentTheme.color
    );
  }

  renderPlaces() {
    let yCoordinate = this.stopLabelYCoordinate + this.placesHeightOffset;

    for (const place of this.stop.places) {
      this.helperCanvas.drawOutlineRect(
        40, yCoordinate - 10, 150, 40, '#ccc'
      );

      this.helperCanvas.writeText(
        place.name,
        80,
        yCoordinate + 1,
        8,
        this.currentTheme.color,
        'bold 8px Courier New'
      );

      this.renderPlacesMarker(place, yCoordinate);
      this.renderPlacesDates(place, yCoordinate);

      yCoordinate += this.placesHeightOffset;
    }
  }

  renderPlacesMarker(place: { name: string, type: string }, yCoordinate: number) {
    const image = document.createElement('img');

    if (place.type === 'attraction') {
      image.src = this.iconsBaseUrl +
        'anchor-' + this.currentTheme.placesMarkerColor + '.svg';
    } else if (place.type === 'hotel') {
      image.src = this.iconsBaseUrl +
        'bed-' + this.currentTheme.placesMarkerColor + '.svg';
    }

    image.onload = () => {
      this.helperCanvas.drawFilledCircle(
        20, yCoordinate + 8, 10, '#ccc'
      );
      this.helperCanvas.drawFilledCircle(
        20, yCoordinate + 8, 9, this.currentTheme.backgroundColor
      );
      image.style.backgroundColor = this.currentTheme.color;
      this.helperCanvas.drawBitmap(image, 20, yCoordinate + 8, 0);
    };
  }

  renderPlacesDates(place: { name: string, type: string }, yCoordinate: number) {
    const aDate = this.arrivalDate;
    const dDate = this.departureDate;
    const dateFontSize = 6;
    const dateXCoordinate = 80;

    this.helperCanvas.writeText(
      'Arrival: ' + aDate.toLocaleDateString() + ' ' + aDate.toLocaleTimeString(),
      dateXCoordinate, yCoordinate + 10,
      dateFontSize, this.currentTheme.dateColor
    );

    this.helperCanvas.writeText(
      'Departure: ' + dDate.toLocaleDateString() + ' ' + dDate.toLocaleTimeString(),
      dateXCoordinate, yCoordinate + 18,
      dateFontSize, this.currentTheme.dateColor
    );
  }
}
