import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // User data
  currentUser = {
    name: 'Youssef Harrabi',
    title: 'Tourism Partner',
    progress: 72,
    profileImage: '../assets/img/avatars/1.png'
  };
  
  // Current date for the dashboard
  currentDate = new Date();
  
  // Statistics data
  statistics = {
    profit: {
      amount: 12628,
      percentage: 72.80,
      trend: 'up'
    },
    sales: {
      amount: 4679,
      percentage: 28.42,
      trend: 'up'
    },
    payments: {
      amount: 2456,
      percentage: 14.82,
      trend: 'down'
    },
    transactions: {
      amount: 14857,
      percentage: 28.14,
      trend: 'up'
    }
  };
  
  // Profile report data
  profileReport = {
    year: 2021,
    amount: '84,686',
    growth: 68.2
  };
  
  // Order statistics
  orderStatistics = {
    totalOrders: 8258,
    totalSales: '42.82k',
    categories: [
      { name: 'Electronic', desc: 'Mobile, Earbuds, TV', sales: '82.5k', icon: 'bx-mobile-alt', color: 'primary' },
      { name: 'Fashion', desc: 'T-shirt, Jeans, Shoes', sales: '23.8k', icon: 'bx-closet', color: 'success' },
      { name: 'Decor', desc: 'Fine Art, Dining', sales: '849k', icon: 'bx-home-alt', color: 'info' },
      { name: 'Sports', desc: 'Football, Cricket Kit', sales: '99', icon: 'bx-football', color: 'secondary' }
    ]
  };
  
  // Income information
  income = {
    totalBalance: 459.10,
    growth: 42.9,
    weeklyExpenses: 39
  };
  
  // Recent transactions
  transactions = [
    { type: 'Paypal', title: 'Send money', amount: 82.6, currency: 'USD', icon: 'paypal.png' },
    { type: 'Wallet', title: 'Mac\'D', amount: 270.69, currency: 'USD', icon: 'wallet.png' },
    { type: 'Transfer', title: 'Refund', amount: 637.91, currency: 'USD', icon: 'chart.png' },
    { type: 'Credit Card', title: 'Ordered Food', amount: -838.71, currency: 'USD', icon: 'cc-success.png' },
    { type: 'Wallet', title: 'Starbucks', amount: 203.33, currency: 'USD', icon: 'wallet.png' },
    { type: 'Mastercard', title: 'Ordered Food', amount: -92.45, currency: 'USD', icon: 'cc-warning.png' }
  ];

  constructor() { }

  ngOnInit(): void {
    // In a real application, you'd initialize charts or load data here
    this.initCharts();
  }

  initCharts(): void {
 
    console.log('Charts would be initialized here in a real application');
    

  }

  // Format number with commas
  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // Get current year for the footer
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}