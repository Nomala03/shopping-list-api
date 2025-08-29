export interface Item {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateItem {
  name: string;
  quantity: number;
  purchased?: boolean;
}

export interface UpdateItem {
  name?: string;
  quantity?: number;
  purchased?: boolean;
}
