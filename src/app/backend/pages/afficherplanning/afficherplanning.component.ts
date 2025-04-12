import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { PlanningService } from 'src/app/services/planning.service';

@Component({
  selector: 'app-afficherplanning',
  templateUrl: './afficherplanning.component.html',
  styleUrls: ['./afficherplanning.component.css']
})
export class AfficherplanningComponent implements OnInit {
  events: any[] = [];

  constructor(private planningService: PlanningService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPlanning();
  }

  loadPlanning() {
    this.planningService.getPlanning().subscribe({
      next: (data: any[]) => {
        this.events = data.map(planning => {
          // Vérification sécurisée de l'objet guide
          const guideName = planning.guide?.name || 'Aucun guide';
          const guideId = planning.guide?.id || '';

          return {
            id: planning.id,
            title: `Guide: ${guideName}`,
            date: planning.date,
            backgroundColor: planning.isreserved ? 'red' : 'green',
            extendedProps: {
              isReserved: planning.isreserved,
              guideId: guideId
            }
          };
        });
        this.initCalendar();
      },
      error: (err) => {
        console.error('Erreur lors du chargement du planning:', err);
      }
    });
  }

  initCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
      const calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: this.events,
        eventClick: (info) => {
          const guideId = info.event.extendedProps['guideId'];
          const eventId = info.event.id;
          alert(`Événement ID: ${eventId}\nGuide ID: ${guideId || 'Non disponible'}`);
        }
      });
      calendar.render();
    } else {
      console.error('Element calendar non trouvé');
    }
  }
}