import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { CryptoService } from '../../services/crypto.service';
import { CryptoHistoricalComponent } from "../crypto-historical/crypto-historical.component";

interface CryptoPrice {
  usd: number;
  change?: number;
}

@Component({
  selector: 'app-crypto-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, CryptoHistoricalComponent],
  templateUrl: './crypto-dashboard.component.html',
  styleUrl: './crypto-dashboard.component.css'
})

export class CryptoDashboardComponent implements OnInit {
  coins = ['bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'solana'];
  selectedCoin: string = 'bitcoin';
  prices: { [key: string]: CryptoPrice } = {};
  previousPrices: { [key: string]: number } = {};

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.cryptoService.getCryptoPrices(this.coins).subscribe({
      next: (data) => {
        this.updatePrices(data);
      },
      error: (error) => {
        console.error('Error fetching prices:', error);
      },
    });
  }

  getIconUrl(coin: string): string {
    return `assets/crypto-icons/${coin}.svg`;
  }

  updatePrices(newPrices: { [key: string]: any }): void {
    this.coins.forEach((coin) => {
      const currentPrice = newPrices[coin].usd;
      if (this.previousPrices[coin] !== undefined) {
        const previousPrice = this.previousPrices[coin];
        const change = ((currentPrice - previousPrice) / previousPrice) * 100;
        this.prices[coin] = {
          usd: currentPrice,
          change: parseFloat(change.toFixed(2)), // round to 2 decimal places
        };
      } else {
        this.prices[coin] = { usd: currentPrice };
      }
      // Store current price for the next update
      this.previousPrices[coin] = currentPrice;
    });
  }

  
}