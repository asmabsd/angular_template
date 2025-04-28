import { Component, OnInit } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { User } from 'src/app/models/user.model';
import { Guide } from 'src/app/models/guide.model';
import { GuideService } from 'src/app/services/guide.service';
import { HttpClient } from '@angular/common/http';
import { CurrencyService } from 'src/app/services/currency.service';
import { TranslationService } from 'src/app/services/translation-service.service';
import { PlanningService } from 'src/app/services/planning.service';
@Component({
  selector: 'app-ReservationGuide',
  templateUrl: './ReservationGuide.component.html',
  styleUrls: ['./ReservationGuide.component.css']
})
export class ReservationGuideComponent implements OnInit {
  // Variables de contrôle
showBouncingIcon = false;
showChatBubble = false;
isTranslating = false;

  showTranslationOption = false;
  
  currencies = ['EUR', 'USD', 'TND', 'GBP', 'CAD', 'JPY', 'CHF', 'CNY', 'SAR', 'AED'];
  selectedCurrency = 'EUR'; // Devise sélectionnée par défaut
  convertedPrice: number | null = null; // Prix converti (null initialement)

  selectedGuideId: number | null = null;
  ReservationReservationGuideForm!: FormGroup;
  users: any[] = [];
  allUsers: any[] = [];
  guideDetails: any = null;
  
  
  constructor(
    private ReservationGuideService: ReservationGuideService,
    private userService: UserService,
    private guideService: GuideService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private planningService: PlanningService,
    private translationService : TranslationService,
    private currencyService: CurrencyService // Injection de CurrencyService
  ) {
    this.initForm();
  }
  
 

  ngOnInit() {
    this.loadUsers();
    this.getGuideFromRoute();
    this.ReservationReservationGuideForm.get('price')?.valueChanges.subscribe(() => {
      this.convertPrice();
    });
  
    this.ReservationReservationGuideForm.get('currency')?.valueChanges.subscribe(() => {
      this.convertPrice();
    });

    this.ReservationReservationGuideForm.get('comment')?.valueChanges.subscribe(val => {
      if (val && val.length > 3) {
        setTimeout(() => {
          this.showBouncingIcon = true;
        }, 3000);
      } else {
        this.showBouncingIcon = false;
      }
    });
  }

  showTranslationOffer() {
    this.showBouncingIcon = false;
    this.showChatBubble = true;
  }

  
  
  cancelTranslation() {
    this.showChatBubble = false;
  }
  



  initForm() {
    this.ReservationReservationGuideForm = this.fb.group({
      duration: ['', Validators.required],
      status: ['pending', Validators.required],
      userId: ['', Validators.required],
      guideId: ['', Validators.required],
      price: [0, Validators.required],
      comment: ['', [Validators.required]],
      dateHour: ['', Validators.required],
      currency: ['EUR', Validators.required], // <-- ajouté ici

    });
  }

  

  getGuideFromRoute() {
    this.route.queryParams.subscribe(params => {
      this.selectedGuideId = params['guideId'] ? +params['guideId'] : null;
      
      if (this.selectedGuideId) {
        console.log('Guide sélectionné:', this.selectedGuideId);
        this.loadGuideDetails(this.selectedGuideId);
        this.ReservationReservationGuideForm.patchValue({
          guideId: this.selectedGuideId
        });
      }
    });
  }

  loadGuideDetails(guideId: number) {
    this.guideService.getGuideById(guideId).subscribe(
      (guide: any) => {
        this.guideDetails = guide;
        console.log('Détails du guide:', this.guideDetails);
      },
      error => {
        console.error('Erreur lors du chargement du guide', error);
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.allUsers = users;
        this.users = users.map(user => ({
          id: user.id,
          email: user.email
        }));
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }






private padZero(n: number): string {
  return n < 10 ? '0' + n : n.toString();
}
translateComment() {
  const commentControl = this.ReservationReservationGuideForm.get('comment');
  const comment = commentControl?.value;
  const targetLang = this.guideDetails?.language;

  if (comment && targetLang) {
    this.isTranslating = true;
    
    this.ReservationGuideService.translateText(comment, targetLang).subscribe({
      next: (translatedText) => {
        commentControl?.setValue(translatedText); // Reçoit directement "مرحبا"
        this.isTranslating = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.isTranslating = false;
      }
    });
  }
}




private showTranslationError() {
  // Vous pouvez implémenter un toast ou une alerte
  console.warn('La traduction a échoué, le commentaire original sera envoyé');
}


   /* onSubmit() {
        if (this.ReservationReservationGuideForm.valid) {
          const formValue = this.ReservationReservationGuideForm.value;
          const guideId = formValue.guideId;
      
          const userId = formValue.userId;
         
        
       
    
        


          // Conversion correcte au format ISO sans millisecondes ni "Z"
          const dateObj = new Date(formValue.dateHour);
          let localISOString = dateObj.toISOString().split('.')[0];
          if (localISOString.endsWith('Z')) {
            localISOString = localISOString.slice(0, -1);
          }

          const payload: ReservationGuide = {
            duration: formValue.duration,
            status: formValue.status,
            price: formValue.price,
            comment: formValue.comment,
            dateHour: dateObj,
            user: { id: formValue.userId } as User,
            guide: { id: guideId } as Guide,
          } as ReservationGuide;
      
          this.ReservationGuideService.addReservationGuide(payload).subscribe({
            next: response => {
              console.log('✅ Réservation créée avec succès', response);
              this.router.navigate(['/listereservationsguide/byuser', userId]);
            },
            error: error => {
              console.error('❌ Erreur lors de la création de la réservation', error);
            }
          });
        }
      }
    */
    



// Ajoutez cette méthode à votre classe
translateAndUpdateComment(): void {
  const comment = this.ReservationReservationGuideForm.get('comment')?.value;
  const targetLang = this.guideDetails?.language; // Langue du guide

  if (comment && targetLang) {
    this.isTranslating = true;

    this.ReservationGuideService.translateText(comment, targetLang).subscribe({
      next: (translatedText) => {
        // Mise à jour du champ commentaire avec la traduction
        this.ReservationReservationGuideForm.get('comment')?.setValue(translatedText);
        this.isTranslating = false;
        
        // Optionnel : Feedback visuel
        this.showTranslationSuccess();
      },
      error: (err) => {
        console.error('Erreur de traduction:', err);
        this.isTranslating = false;
        // Ici vous pourriez garder le texte original ou afficher une erreur
      }
    });
  }
}
private showTranslationSuccess(): void {
  const commentControl = this.ReservationReservationGuideForm.get('comment');
  const commentElement = document.querySelector('#comment'); // Replace with the actual ID or class of the comment input
  commentElement?.classList.add('translation-success');
  setTimeout(() => {
    commentElement?.classList.remove('translation-success');
  }, 2000);
}

    
/*  navigateToList() {
    this.router.navigate(['/listereservationsguide']);
  }
*/
  convertPrice() {
    const price = this.ReservationReservationGuideForm.get('price')?.value;
    const selectedCurrency = this.ReservationReservationGuideForm.get('currency')?.value;
  
    console.log('Prix:', price, 'Devise:', selectedCurrency);
  
    if (!price || price <= 0 || !selectedCurrency) {
      this.convertedPrice = null;
      return;
    }
  
    this.currencyService.convert('EUR', selectedCurrency).subscribe({
      next: data => {
        const rate = data.conversion_rate;
        this.convertedPrice = price * rate;
        console.log(`Taux EUR → ${selectedCurrency} : ${rate}, Prix converti: ${this.convertedPrice}`);
      },
      error: err => {
        console.error('Erreur lors de la conversion:', err);
        this.convertedPrice = null;
      }
    });
  }
  

  async onSubmit() {
    if (this.ReservationReservationGuideForm.valid) {
      try {
        // Attendre la fin de la traduction si elle est en cours
        if (this.isTranslating) {
          await this.translateComment();
        }
  
        const formValue = this.ReservationReservationGuideForm.value;
        const dateObj = new Date(formValue.dateHour);
        
        const payload: ReservationGuide = {
          duration: formValue.duration,
          status: formValue.status,
          price: formValue.price,
          comment: formValue.comment,
          dateHour: dateObj,
          user: { id: formValue.userId } as User,
          guide: { id: formValue.guideId } as Guide,
        }as ReservationGuide;
  

        const response = await lastValueFrom(this.ReservationGuideService.addReservationGuide(payload));        console.log('✅ Réservation créée avec succès', response);
        this.router.navigate(['/listereservationsguide/byuser', formValue.userId]);
        
      } catch (error) {
        console.error('❌ Erreur lors de la création de la réservation', error);
      }
    }
  }


  navigateToList() {
    // Récupérez l'email de l'utilisateur connecté
    const formValue = this.ReservationReservationGuideForm.value;

    const userId = formValue.userId;

    // OU si vous avez déjà l'email dans le composant :
    // const userEmail = this.userEmail; // Si vous l'avez déjà stocké
    
    // Redirection vers la liste des réservations avec l'email
    this.router.navigate(['/listereservationsguide/byuser', userId]);
  }
}

