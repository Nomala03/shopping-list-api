export interface Item {
  id: string;
  name: string;
  quantity: number;
  purchased: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateItemDTO {
  name: string;
  quantity: number;
  purchased?: boolean;
}

export interface UpdateItemDTO {
  name?: string;
  quantity?: number;
  purchased?: boolean;
}