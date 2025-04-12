import { Component } from '@angular/core';
import { TransportService } from 'src/app/services/transport.service';
import { Transport } from 'src/app/models/transport.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listetransport',
  templateUrl: './listetransport.component.html',
  styleUrls: ['./listetransport.component.css']
})
export class ListetransportComponent {
  transports: Transport[] = [];

  constructor(private transportService: TransportService, private router: Router) {}

  ngOnInit(): void {
    this.transportService.getAllTransports().subscribe(
      (data) => {
        this.transports = data;
      }
    );
  }

  deleteTransport(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce transport ?')) {
      this.transportService.deleteTransport(id).subscribe(
        () => {
          // Retire l’élément de la liste localement
          this.transports = this.transports.filter(t => t.id !== id);
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
          alert('Erreur lors de la suppression du transport.');
        }
      );
    }
  }
  
}
