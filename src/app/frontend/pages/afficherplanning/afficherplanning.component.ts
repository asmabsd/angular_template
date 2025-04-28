import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute } from '@angular/router';
import { PlanningService } from 'src/app/services/planning.service';
import { Router } from '@angular/router';
import { Guide } from 'src/app/models/guide.model';
@Component({
  selector: 'app-afficherplanning',
  templateUrl: './afficherplanning.component.html',
  styleUrls: ['./afficherplanning.component.css']
})
export class AfficherplanningComponent implements OnInit {

  events: any[] = [];

  constructor(
    private planningService: PlanningService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const guideId = Number(this.route.snapshot.paramMap.get('guideId'));
    if (!isNaN(guideId)) {
      this.loadPlanning(guideId);
    } else {
      console.error("ID du guide non valide");
    }
  }

  loadPlanning(guideId: number) {
    this.planningService.getPlanningByGuideId(guideId).subscribe({
      next: (data: any[]) => {
        const plannings = Array.isArray(data) ? data : [data];

        this.events = plannings.map(planning => {
          console.log("Planning reçu :", planning);

          const guideName = (planning.guide as Guide)?.name || 'Nom du guide';
          const isReserved = planning.is_reserved ?? planning.isReserved;

          // Utilise le bon champ de date ici selon ton backend
          const rawDate = planning.date ?? planning.datePlanning;

          const parsedDate = rawDate ? new Date(rawDate) : null;

          if (!parsedDate || isNaN(parsedDate.getTime())) {
            console.warn("Date invalide pour l'événement :", planning);
            return null;
          }

          return {
            id: planning.id,
            title: isReserved ? `${guideName}` : `NON Disponible`,
            date: parsedDate.toISOString(),
            backgroundColor: isReserved ? 'red' : 'green',
            extendedProps: {
              isReserved: isReserved,
              guideId: typeof planning.guide === 'number' ? planning.guide : (planning.guide as Guide).id
            }
          };
        }).filter(e => e !== null);

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
        eventDidMount: (info) => {
          const isReserved = info.event.extendedProps['isReserved'];

          if (!isReserved) {
            info.el.classList.add('event-disponible');
          } else {
            info.el.classList.add('event-reserve');
          }
        },
        eventClick: (info) => {
          const guideId = info.event.extendedProps['guideId'];
          const isReserved = info.event.extendedProps['isReserved'];

          if (!isReserved && guideId) {
            this.router.navigate(['/resguide', guideId]);
          } else {
            alert("Ce créneau est déjà réservé.");
          }
        },
        dayCellDidMount: (info) => {
          const dateStr = info.date.toISOString().split('T')[0];
          const event = this.events.find(e => e.date.startsWith(dateStr));

          if (event && !event.extendedProps.isReserved) {
            const button = document.createElement('button');
            button.innerHTML = 'Book this guide now';
            button.classList.add('book-button');
            button.onclick = () => {
              this.router.navigate(['/resguide', event.extendedProps.guideId]);
            };

            info.el.appendChild(button);
          }
        }
      });

      calendar.render();
    } else {
      console.error('Élément calendar non trouvé');
    }
  }

}