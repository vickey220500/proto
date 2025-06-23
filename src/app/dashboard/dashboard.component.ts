import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  selectedCard: string | null = null;
  chart: Chart | null = null;

  cards = [
    { key: 'dailyLoan', label: 'Daily Loan' },
    { key: 'dplList', label: 'DPL List' },
    { key: 'chit', label: 'Chit' },
  ];

  selectCard(cardKey: string) {
    this.selectedCard = cardKey;

    
    if (this.chart) {
      this.chart.destroy();
    }

    // Get the canvas element
    const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: `${cardKey} Data`,
              data: this.getDummyData(cardKey),
              backgroundColor: '#9a6735db',
              borderColor: '#9a6735db',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  getDummyData(cardKey: string): number[] {
    switch (cardKey) {
      case 'dailyLoan':
        return [10, 20, 30, 40, 50];
      case 'dplList':
        return [5, 15, 25, 35, 45];
      case 'chit':
        return [12, 22, 32, 42, 52];
      default:
        return [];
    }
  }

}
