import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CryptoDashboardComponent } from './components/crypto-dashboard/crypto-dashboard.component';
import { CryptoHistoricalComponent } from "./components/crypto-historical/crypto-historical.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CryptoDashboardComponent, CryptoHistoricalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto-dashboard';
}
