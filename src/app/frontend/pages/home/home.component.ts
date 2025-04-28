import { Component } from '@angular/core';
import { ChatService } from '../../../services/chat.service'; // adapte le chemin si besoin

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userMessage = '';
  conversation: { user: string, bot: string }[] = [];
  isLoading = false;

  constructor(private chatService: ChatService) { }
  chatVisible = false;

toggleChat() {
  this.chatVisible = !this.chatVisible;
}


  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.isLoading = true;

    this.chatService.sendMessage(this.userMessage).subscribe({
      next: (response: { user: string; bot: string }) => {
      this.conversation.push({ user: response.user, bot: response.bot });
      this.userMessage = '';
      this.isLoading = false;
      },
      error: (err: any) => {
      console.error('Erreur chatbot:', err);
      this.conversation.push({ user: this.userMessage, bot: "Erreur lors de l'envoi du message." });
      this.userMessage = '';
      this.isLoading = false;
      }
    });
  }
}
