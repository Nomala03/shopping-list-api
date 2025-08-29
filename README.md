# shopping-list-api

# Shopping List API

A simple in-memory Shopping List API built with Node.js and TypeScript.  
Supports CRUD operations for items.

---

## Base URL
http://localhost:4000


---

## Endpoints

### 1. Get All Items

**GET** `/items`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Whole Milk",
      "quantity": 2,
      "purchased": false,
    },
    {
      "id": "2",
      "name": "Bread",
      "quantity": 1,
      "purchased": false,
    }
  ]
}

### 2. Get Item by ID
GET /items/:id
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Whole Milk",
    "quantity": 2,
    "purchased": false,
    "createdAt": "2025-08-29T12:44:53.860Z",
    "updatedAt": "2025-08-29T12:44:53.860Z"
  }
}

Errors:

404 Not Found if the item ID does not exist.

---
### 3. Create New Item
POST /items

Headers:

Content-Type: application/json
 
Request Body 
{
  "name": "Bread",
  "quantity": 1,
  "purchased": false
}

**Response:**
```json

{
  "success": true,
  "data": {
    "id": "2",
    "name": "Bread",
    "quantity": 1,
    "purchased": false,
    "createdAt": "2025-08-29T12:45:10.944Z",
    "updatedAt": "2025-08-29T12:45:10.944Z"
  }
}
Errors:

400 Bad Request if required fields are missing or invalid.

### 4. Update Item

PUT /items/:id

Headers:
Content-Type: application/json

URL Parameters:
id (string) — The numeric ID of the item.


**Request Body**
```json

{
  "name": "Whole Milk",
  "quantity": 3,
  "purchased": true
}

Response:


{
  "success": true,
  "data": {
    "id": "1",
    "name": "Whole Milk",
    "quantity": 3,
    "purchased": true,
    "createdAt": "2025-08-29T12:44:53.860Z",
    "updatedAt": "2025-08-29T12:50:00.123Z"
  }
}

Errors:
400 Bad Request if all fields are missing or invalid.
404 Not Found if the item ID does not exist.

### 5. Delete Item 
URL Parameters:
id (string) — The numeric ID of the item.

Response:
204 No Content on success.

Errors:
404 Not Found if the item ID does not exist.

Error Format
For all errors, the API returns JSON like:

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      { "field": "name", "message": "name is required" }
    ]
  }
}

Error Codes:
BAD_REQUEST (400)
NOT_FOUND (404)
METHOD_NOT_ALLOWED (405)
PAYLOAD_TOO_LARGE (413)
INTERNAL_SERVER_ERROR (500)

