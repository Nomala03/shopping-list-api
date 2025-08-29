import http, { IncomingMessage, ServerResponse } from "http";
import { parse as parseUrl } from "url";
import { sendError, sendJSON, parseJSONBody } from "./utils/http";
import { HttpError } from "./utils/errors";
import * as store from "./store/itemsStore";
import { CreateItem, UpdateItem } from "./models/item";

const PORT = 4000;

function notFound() {
  throw new HttpError(404, "NOT_FOUND", "Item not found");
}

function methodNotAllowed(method: string) {
  throw new HttpError(
    405,
    "METHOD_NOT_ALLOWED",
    `${method} is not allowed for this endpoint`
  );
}

function isString(input: unknown): input is string {
  return typeof input === "string" && input.trim().length > 0;
}

function isNumber(input: unknown): input is number {
  return typeof input === "number" && Number.isInteger(input);
}

function isBoolean(input: unknown): input is boolean {
  return typeof input === "boolean";
}

//Create Item (POST): we are expecting data from the client
function validateCreate(body: unknown): CreateItem {
  if (!body || typeof body !== "object") {
    throw new HttpError(
      400,
      "BAD_REQUEST",
      "Request body must be a JSON object"
    );
  }

  const { name, quantity, purchased } = body as Partial<CreateItem>;
  const details: Array<{ field: string; message: string }> = [];

  if (!isString(name)) {
    details.push({
      field: "name",
      message: "name is required and must be a non-empty string",
    });
  }
  if (!isNumber(quantity) || quantity < 1) {
    details.push({
      field: "quantity",
      message: "quantity is required and must be a number >= 1",
    });
  }
  if (purchased !== undefined && !isBoolean(purchased))
    details.push({
      field: "purchased",
      message: "purchased must be a boolean",
    });

  if (details.length) {
    throw new HttpError(400, "BAD_REQUEST", "Validation failed", details);
  }

  return { name: name!, quantity: quantity!, purchased };
}

//Update Item(PUT): used for editting item
function validateUpdate(body: unknown): UpdateItem {
  if (!body || typeof body !== "object") {
    throw new HttpError(
      400,
      "BAD_REQUEST",
      "Request body must be a JSON object"
    );
  }

  const details: Array<{ field: string; message: string }> = [];
  const data: UpdateItem = {};

  const { name, quantity, purchased } = body as Partial<UpdateItem>;

  if (name !== undefined) {
    if (!isString(name))
      details.push({
        field: "name",
        message: "name must be a non-empty string",
      });
    else data.name = name;
  }

  if (quantity !== undefined) {
    if (!isNumber(quantity) || quantity < 1)
      details.push({
        field: "quantity",
        message: "quantity must be a number >= 1",
      });
    else data.quantity = quantity;
  }

  if (purchased !== undefined) {
    if (!isBoolean(purchased))
      details.push({
        field: "purchased",
        message: "purchased must be a boolean",
      });
    else data.purchased = purchased;
  }

  if (Object.keys(data).length === 0) {
    //meaning there are no values given for the Items
    details.push({
      field: "*",
      message: "Provide at least one of these: name, quantity, purchased",
    });
  }

  if (details.length) {
    throw new HttpError(400, "BAD_REQUEST", "Validation failed", details);
  }

  return data;
}

function extractId(pathname: string | null | undefined): string | null {
  if (!pathname) return null;
  const parts = pathname.split("/").filter(Boolean);
  // expecting ["items", ":id"]
  if (parts.length === 2 && parts[0] === "items") return parts[1];
  return null;
}

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const method = (req.method || "GET").toUpperCase();
      const { pathname } = parseUrl(req.url || "/", true);

      const path = pathname?.replace(/\/$/, "") || "/";

      // Routes
      if (path === "/items") {
        if (method === "GET") {
          const data = store.getAll();
          return sendJSON(res, 200, { success: true, data });
        }
        if (method === "POST") {
          const body = await parseJSONBody<CreateItem>(req);
          const data = validateCreate(body);
          const created = store.create(data);
          return sendJSON(res, 201, { success: true, data: created });
        }
        return methodNotAllowed(method);
      }

      // /items/:id
      const id = extractId(path);
      if (id) {
        if (method === "GET") {
          const item = store.getById(id);
          if (!item) notFound();
          return sendJSON(res, 200, { success: true, data: item });
        }
        if (method === "PUT") {
          const body = await parseJSONBody<UpdateItem>(req);
          const data = validateUpdate(body);
          const updated = store.update(id, data);
          if (!updated) notFound();
          return sendJSON(res, 200, { success: true, data: updated });
        }
        if (method === "DELETE") {
          const ok = store.remove(id);
          if (!ok) notFound();

          // Sprint 4 requirement: 204 No Content on delete
          res.statusCode = 204;
          return res.end();
        }
        return methodNotAllowed(method);
      }

      notFound();
    } catch (err) {
      sendError(res, err as Error);
    }
  }
);

server.listen(PORT, () => {
  console.log(`Shopping List API listening on http://localhost:${PORT}`);
});
