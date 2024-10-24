import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  //private readonly apiUrl = 'https://api.coingecko.com/api/v3/simple/price';
  private readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  getCryptoPrices(coins: string[]): Observable<any> {
    // Poll the API every 30 seconds
    return timer(0, 30000).pipe(
      switchMap(() =>{
        console.log(`Fetching prices at ${new Date().toLocaleTimeString()}`); 
        return this.http
        .get<any>(`${this.BASE_URL}/simple/price?ids=${coins.join(',')}&vs_currencies=usd`)
        .pipe(
          retry({
            count: 5,
            delay: (error, retryCount) => {
              if (error.status === 429) {
                const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                return timer(retryDelay);
              }
              // For other errors, do not retry
              return throwError(() => error);
            },
            resetOnSuccess: false,
          }),
          catchError((error) => {
            // Handle the error appropriately
            console.error('Error fetching prices:', error);
            return throwError(() => error);
          })
        )
      }
        
      )
    );
  }
  
  async getCryptoPriceOnce(coin: string): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.get<any>(`${this.BASE_URL}/simple/price?ids=${coin}&vs_currencies=usd`)
      );
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  }

  getHistoricalData(coin: string, days: number = 30): Observable<any> {
    const url = `${this.BASE_URL}/coins/${coin}/market_chart`; 
    const params = {
      vs_currency: 'usd',
      days: days.toString(), 
    };
    return this.http.get(url, { params });
  }
}
