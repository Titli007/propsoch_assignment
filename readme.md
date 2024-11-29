
# API Documentation

## Users

### Create User
**POST** `/users/`  
Creates a new user.

#### Request Body
```json
{
  "id": "integer",
  "email": "string",
  "password": "string",
  "defaultCurrency": "string (optional, default is 'USD')"
}
```

#### Response
- **201 Created**
```json
{
  "success": true,
  "data": {
    "id": "integer",
    "email": "string",
    "defaultCurrency": "string"
  }
}
```
- **400 Bad Request**
```json
{
  "success": false,
  "error": "string"
}
```

### Update User
**PUT** `/users/:id`  
Updates an existing user.

#### Request Body
```json
{
  "email": "string (optional)",
  "defaultCurrency": "string (optional)"
}
```

#### Response
- **200 OK**
```json
{
  "success": true,
  "data": "Updated user details"
}
```
- **404 Not Found**
```json
{
  "success": false,
  "error": "User not found"
}
```

## Expenses

### Create Expense
**POST** `/expenses/`  
Creates a new expense.

#### Request Body
```json
{
  "name": "string",
  "value": "decimal",
  "currency": "string",
  "memberIds": ["array of integers"],
  "date": "string (optional, default is current date)"
}
```

#### Response
- **201 Created**
```json
{
  "success": true,
  "data": "Created expense with details"
}
```
- **404 Not Found**
```json
{
  "success": false,
  "error": "Users not found with IDs: [missing IDs]"
}
```

### Get Expenses
**GET** `/expenses/`  
Fetches all expenses for the logged-in user.

#### Response
- **200 OK**
```json
{
  "success": true,
  "data": ["list of expenses"]
}
```

## Balances

### Get User Balances
**GET** `/balances/`  
Fetches all balances for the logged-in user.

#### Response
- **200 OK**
```json
{
  "success": true,
  "data": ["list of balances"]
}
```

---

### Error Responses
All endpoints return the following in case of errors:

- **400 Bad Request**
```json
{
  "success": false,
  "error": "string"
}
```
- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```
