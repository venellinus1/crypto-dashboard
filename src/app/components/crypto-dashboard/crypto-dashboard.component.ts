import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Subscription } from 'rxjs';
import { NgFor, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-crypto-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './crypto-dashboard.component.html',
  styleUrls: ['./crypto-dashboard.component.css'],
})
export class CryptoDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  coins = ['bitcoin', 'ethereum', 'litecoin']; // Update coin identifiers to match icon filenames
  prices: any = {};
  subscription!: Subscription;
  errorMessage = '';

  constructor(
    private cryptoService: CryptoService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.cryptoService.getCryptoPrices(this.coins).subscribe({
      next: (data) => {
        console.log(`Received new prices at ${new Date().toLocaleTimeString()}`, data);
        this.prices = data;
        this.setAnimationDuration();
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while fetching prices.';
        console.error(error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.setAnimationDuration();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setAnimationDuration(): void {
    const ticker = this.elRef.nativeElement.querySelector('.ticker');
    if (ticker) {
      const tickerWidth = ticker.scrollWidth;
      const duration = tickerWidth / 50; // Adjust the divisor to control speed
      ticker.style.animationDuration = `${duration}s`;
    }
  }

  getIconUrl(coin: string): string {
    return `assets/crypto-icons/${coin}.svg`;
  }

  onIconError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/icons/default.svg'; // Use a default icon if needed
  }
}
