import { Component, OnInit } from '@angular/core';
import { PredictionService, PredictionRequest } from 'src/app/services/prediction.service';
import { GastronomyService } from 'src/app/services/gastronomy.service';

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css']
})
export class PredictionComponent  {
  request: PredictionRequest = {
    location: '',
    rating: 0
  };

  predictionResult: string | null = null;
  error: string | null = null;

  constructor(private predictionService: PredictionService) {}

  onSubmit() {
    this.predictionService.predict(this.request).subscribe({
      next: (result) => {
        this.predictionResult = result;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Erreur lors de la prédiction.';
        this.predictionResult = null;
        console.error(err);
      }
    });
  }
}
