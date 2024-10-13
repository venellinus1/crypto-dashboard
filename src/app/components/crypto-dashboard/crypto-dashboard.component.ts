import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-crypto-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './crypto-dashboard.component.html',
  styleUrl: './crypto-dashboard.component.css'
})

export class CryptoDashboardComponent implements OnInit {
  coins = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'solana'];
  prices: any = {};

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getCryptoPrices(this.coins).subscribe({
      next: (data) => {
        this.prices = data;
      },
      error: (error) => {
        console.error('Error fetching prices:', error);
      },
    });
  }

  getIconUrl(coin: string): string {
    return `assets/crypto-icons/${coin}.svg`;
  }
}