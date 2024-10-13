import { Component, OnInit, OnDestroy } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Subscription } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-crypto-dashboard',
  templateUrl: './crypto-dashboard.component.html',
  styleUrls: ['./crypto-dashboard.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, CommonModule]
})
export class CryptoDashboardComponent implements OnInit, OnDestroy {
  coins = ['bitcoin', 'ethereum', 'litecoin'];
  prices: any = {};

  priceSubscription!: Subscription;
  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.priceSubscription = this.cryptoService.getCryptoPrices(this.coins).subscribe({
      next: (data) => {
        console.log(`Received new prices at ${new Date().toLocaleTimeString()}`, data);
        this.prices = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  async fetchPriceOnce(coin: string) {
    try {
      const data = await this.cryptoService.getCryptoPriceOnce(coin);
      console.log(`Price of ${coin}:`, data);
    } catch (error) {
      console.error('Error fetching price once:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.priceSubscription) {
      this.priceSubscription.unsubscribe();
    }
  }
}
