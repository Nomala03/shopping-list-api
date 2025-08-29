import { CreateItem, Item, UpdateItem } from "../models/item";

const items: Item[] = [];
let nextId = 1;

export function getAll(): Item[] {
  return items;
}

export function getById(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

//create new item
export function create(data: CreateItem): Item {
  const now = new Date().toISOString();
  const item: Item = {
    id: String(nextId++),
    name: data.name.trim(),
    quantity: Math.floor(data.quantity),
    purchased: data.purchased ?? false,
  };
  items.push(item);
  return item;
}

//update an existing item by id
export function update(id: string, data: UpdateItem): Item | undefined {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  const current = items[idx];

  const updated: Item = {
    ...current,
    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
    ...(data.quantity !== undefined
      ? { quantity: Math.floor(data.quantity) }
      : {}),
    ...(data.purchased !== undefined ? { purchased: data.purchased } : {}),
  };

  items[idx] = updated;
  return updated;
}

export function remove(id: string): boolean {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}
