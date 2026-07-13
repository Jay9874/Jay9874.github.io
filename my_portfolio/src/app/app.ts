import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


// Ionic Icon
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, IonIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my_portfolio');
}
