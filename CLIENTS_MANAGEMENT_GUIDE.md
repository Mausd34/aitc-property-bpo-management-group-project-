# Clients Module - Management Guide

## Overview
The Clients module manages all client information for the Property Preservation & BPO Management System.

### Client Model Fields
- **id**: Unique identifier (auto-generated)
- **name**: Client company/person name (required)
- **email**: Email address (required)
- **phone**: Phone number (optional)
- **address**: Physical address (optional)

---

## Method 1: REST API Management (Recommended for developers)

### Base URL
```
http://127.0.0.1:8000/api/clients/
```

### 1. GET - Retrieve All Clients
**Request:**
```bash
GET http://127.0.0.1:8000/api/clients/
```

**Response:**
```json
[
  {
    "id": 5,
    "name": "Masud Mia",
    "email": "masudrana481531@gmail.com",
    "phone": "01963932905",
    "address": "Uttara, Sector 10"
  },
  {
    "id": 4,
    "name": "Demo U.S. Client",
    "email": "demo@example.com",
    "phone": "+1-555-0100",
    "address": "New York, USA"
  }
]
```

### 2. GET - Retrieve Single Client
**Request:**
```bash
GET http://127.0.0.1:8000/api/clients/5/
```

**Response:**
```json
{
  "id": 5,
  "name": "Masud Mia",
  "email": "masudrana481531@gmail.com",
  "phone": "01963932905",
  "address": "Uttara, Sector 10"
}
```

### 3. POST - Create New Client
**Request:**
```bash
POST http://127.0.0.1:8000/api/clients/
Content-Type: application/json

{
  "name": "ABC Property Management",
  "email": "contact@abc.com",
  "phone": "555-1234",
  "address": "123 Main Street, New York"
}
```

**Response:**
```json
{
  "id": 6,
  "name": "ABC Property Management",
  "email": "contact@abc.com",
  "phone": "555-1234",
  "address": "123 Main Street, New York"
}
```

### 4. PUT - Update Entire Client
**Request:**
```bash
PUT http://127.0.0.1:8000/api/clients/5/
Content-Type: application/json

{
  "name": "Updated Masud Mia",
  "email": "masud.new@gmail.com",
  "phone": "01900000000",
  "address": "Dhaka, Bangladesh"
}
```

### 5. PATCH - Partial Update
**Request:**
```bash
PATCH http://127.0.0.1:8000/api/clients/5/
Content-Type: application/json

{
  "phone": "01912345678"
}
```

### 6. DELETE - Remove Client
**Request:**
```bash
DELETE http://127.0.0.1:8000/api/clients/5/
```

**Response:** HTTP 204 No Content

---

## Method 2: Django Admin Interface

### Access Django Admin
1. **URL:** http://127.0.0.1:8000/admin/
2. **Username:** Masud638
3. **Password:** [Your password]

### Manage Clients in Admin
1. Click on **Clients** in the admin panel
2. View all clients with options to:
   - ✅ **Add Client** - Click "Add Client" button
   - ✅ **View Details** - Click on client name
   - ✅ **Edit** - Modify client information
   - ✅ **Delete** - Remove client

### Admin Form Fields
- Name (text input)
- Email (email input)
- Phone (optional, text input)
- Address (optional, textarea)

---

## Practical Examples

### Example 1: Add New Property Developer Client
**Using REST API (cURL):**
```bash
curl -X POST http://127.0.0.1:8000/api/clients/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Properties Ltd",
    "email": "sales@premiumproperties.com",
    "phone": "+1-800-PROPERTY",
    "address": "San Francisco, California, USA"
  }'
```

### Example 2: Update Client Phone Number
**Using REST API:**
```bash
curl -X PATCH http://127.0.0.1:8000/api/clients/4/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1-555-0999"}'
```

### Example 3: List All Clients (Formatted)
**Using PowerShell:**
```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/clients/" -UseBasicParsing
$clients = $response.Content | ConvertFrom-Json
$clients | Format-Table -AutoSize
```

---

## Current Clients in Database

| ID | Name | Email | Phone | Address |
|----|----|----|----|-----|
| 5 | Masud Mia | masudrana481531@gmail.com | 01963932905 | Uttara, Sector 10 |
| 4 | Demo U.S. Client | demo@example.com | +1-555-0100 | New York, USA |
| 3 | Ashik | ashik@gmail.com | 01963932905 | Dhaka |
| 2 | Eaha | esha@gmail.com | 019673628378 | Uttara, Sector 10 |

---

## Browser-Based Testing

### Access Browsable API
Visit: http://127.0.0.1:8000/api/clients/

**Features:**
- ✅ View all clients
- ✅ Use HTML form to add new client
- ✅ Click client ID to view details
- ✅ Edit/Delete buttons in detail view

---

## Related Modules

Once Clients are created, you can:
- ➡️ Add **Properties** for each client
- ➡️ Create **Work Orders** for client properties
- ➡️ Assign **Vendors** to work orders
- ➡️ Track **Documents** and **QA Reviews**
- ➡️ Manage **Notifications** to clients

---

## Common Operations

### Workflow: Add Client → Add Property → Create Work Order

**Step 1: Create Client**
```bash
POST /api/clients/
{
  "name": "New Development Corp",
  "email": "dev@newcorp.com",
  "phone": "555-1234",
  "address": "Suite 100, Tech Plaza"
}
# Returns: Client ID = 7
```

**Step 2: Create Property for Client 7**
```bash
POST /api/properties/
{
  "client": 7,
  "address": "456 Oak Avenue, Downtown",
  "property_type": "Commercial",
  "details": "2-story office building",
  "status": "Active"
}
# Returns: Property ID = 2
```

**Step 3: Create Work Order for Property 2**
```bash
POST /api/work-orders/
{
  "client": 7,
  "property": 2,
  "title": "Building Maintenance",
  "description": "Regular maintenance and repairs",
  "priority": "High",
  "status": "New",
  "due_date": "2026-09-15"
}
```

---

## Notes
- All endpoints require proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- JSON format is standard for API requests/responses
- Django Admin provides visual interface for non-developers
- REST API is ideal for integration with frontend applications
- Both methods sync to the same database immediately
