import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransportService } from 'src/app/services/transport.service';
import { Transport } from 'src/app/models/transport.model';

@Component({
  selector: 'app-detailstransport',
  templateUrl: './detailstransport.component.html',
  styleUrls: ['./detailstransport.component.css']
})
export class DetailsTransportComponent implements OnInit {
  transportId!: number;
  transport?: Transport;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private transportService: TransportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.transportId = +idParam;
      this.transportService.getTransportById(this.transportId).subscribe(
        (data: Transport) => {
          this.transport = data;
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage = 'Erreur lors du chargement des détails.';
          this.isLoading = false;
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/listetransport']);
  }
}
