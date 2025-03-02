export interface IOrder {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderQueryParams {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
} 