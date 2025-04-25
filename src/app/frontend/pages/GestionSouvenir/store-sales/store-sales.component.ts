import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommandLine } from 'src/app/models/GestionSouvenir/CommandLine';
import { MonthlySales } from 'src/app/models/GestionSouvenir/MonthlySales';
import { TopSellingSouvenir } from 'src/app/models/GestionSouvenir/TopSellingSouvenir';
import { SalesService } from 'src/app/services/GestionSouvenirService/sales.service';

@Component({
  selector: 'app-store-sales',
  templateUrl: './store-sales.component.html',
  styleUrls: ['./store-sales.component.css'],
})
export class StoreSalesComponent {
  @ViewChild('pieChart') pieChart?: BaseChartDirective; // Reference to pie chart

  storeId: number;
  monthlySalesData: MonthlySales[] = [];
  topSellingData: TopSellingSouvenir[] = [];
  detailedSales: CommandLine[] = [];

  // Monthly Sales Chart
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartConfiguration['data']['datasets'] = [
    { data: [], label: 'Total Sales ($)' },
  ];

  // Pie Chart Configuration
  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Top Selling Souvenirs',
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor(
    private route: ActivatedRoute,
    private salesService: SalesService
  ) {
    this.storeId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    if (!this.storeId) {
      console.error('Invalid store ID');
      alert('Invalid store ID');
      return;
    }
    this.loadMonthlySales();
    this.loadTopSellingSouvenirs();
    this.loadDetailedSales();
  }

  loadMonthlySales(): void {
    this.salesService.getMonthlySalesByStore(this.storeId).subscribe({
      next: (data: MonthlySales[]) => {
        console.log('Monthly Sales Data:', data);
        this.monthlySalesData = data;
        this.barChartLabels = data.map(
          (item) => `${this.getMonthName(item.month)} ${item.year}`
        );
        this.barChartData[0].data = data.map((item) => item.total);
      },
      error: (err) => {
        console.error('Failed to load monthly sales:', err);
        alert(`Failed to load monthly sales: ${err.status} ${err.statusText}`);
      },
    });
  }

  loadTopSellingSouvenirs(): void {
    this.salesService.getTopSellingSouvenirsByStore(this.storeId).subscribe({
      next: (data: TopSellingSouvenir[]) => {
        console.log('Top Selling Souvenirs Data:', data);
        this.topSellingData = data.slice(0, 5);
        this.pieChartData.labels = this.topSellingData.map(
          (item) => item.souvenir.name
        );
        this.pieChartData.datasets[0].data = this.topSellingData.map(
          (item) => item.totalQuantity
        );
        console.log('Pie Chart Data:', this.pieChartData);
        setTimeout(() => {
          if (this.pieChart) {
            this.pieChart.update();
            console.log('Pie chart updated');
          }
        }, 100); // Delay to ensure chart is rendered
      },
      error: (err) => {
        console.error('Failed to load top-selling souvenirs:', err);
        alert(
          `Failed to load top-selling souvenirs: ${err.status} ${err.statusText}`
        );
      },
    });
  }

  loadDetailedSales(): void {
    this.salesService.getDetailedSalesByStore(this.storeId).subscribe({
      next: (data: CommandLine[]) => {
        console.log('Detailed Sales Data:', data);
        this.detailedSales = data;
      },
      error: (err) => {
        console.error('Failed to load detailed sales:', err);
        alert(`Failed to load detailed sales: ${err.status} ${err.statusText}`);
      },
    });
  }

  private getMonthName(month: number): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month - 1];
  }
}
