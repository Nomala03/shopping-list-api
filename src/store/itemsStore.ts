import { randomUUID } from "crypto";
import { CreateItemDTO, Item, UpdateItemDTO } from "../models/item";

const items: Item[] = [];

export function getAll(): Item[] {
  return items;
}

export function getById(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function create(dto: CreateItemDTO): Item {
  const now = new Date().toISOString();
  const item: Item = {
    id: randomUUID(),
    name: dto.name.trim(),
    quantity: Math.floor(dto.quantity),
    purchased: dto.purchased ?? false,
    createdAt: now,
    updatedAt: now,
  };
  items.push(item);
  return item;
}

export function update(id: string, dto: UpdateItemDTO): Item | undefined {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  const current = items[idx];

  const updated: Item = {
    ...current,
    ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
    ...(dto.quantity !== undefined ? { quantity: Math.floor(dto.quantity) } : {}),
    ...(dto.purchased !== undefined ? { purchased: dto.purchased } : {}),
    updatedAt: new Date().toISOString(),
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