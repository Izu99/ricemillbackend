# Rice Mill Backend - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user with personal and company details.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "nic": "123456789V",
  "address": "123 Main Street",
  "phoneNumber": "+1 (555) 000 0000",
  "companyName": "Acme Corporation",
  "companyUserName": "johndoe",
  "companyAddress": "456 Business Ave",
  "companyPhoneNumber": "+1 (555) 000 0001",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "123abc...",
      "firstName": "John",
      "lastName": "Doe",
      "nic": "123456789V",
      "address": "123 Main Street",
      "phoneNumber": "+1 (555) 000 0000",
      "companyName": "Acme Corporation",
      "companyUserName": "johndoe",
      "companyAddress": "456 Business Ave",
      "companyPhoneNumber": "+1 (555) 000 0001",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-12-04T06:29:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-04T06:29:00.000Z"
}
```

---

### 2. Login
**POST** `/auth/login`

Login with company username and password.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "123abc...",
      "firstName": "John",
      "lastName": "Doe",
      "companyUserName": "johndoe",
      "role": "user",
      ...
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-04T06:30:00.000Z"
}
```

---

### 3. Get Current User Profile
**GET** `/auth/me`

Get the currently logged-in user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "123abc...",
      "firstName": "John",
      "lastName": "Doe",
      ...
    }
  },
  "timestamp": "2025-12-04T06:31:00.000Z"
}
```

---

### 4. Update Profile
**PUT** `/auth/profile`

Update user profile information (cannot change NIC, company username, or password).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "phoneNumber": "+1 (555) 111 2222",
  "companyAddress": "789 New Business St"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": { ... }
  },
  "timestamp": "2025-12-04T06:32:00.000Z"
}
```

---

### 5. Change Password
**PUT** `/auth/change-password`

Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456",
  "confirmNewPassword": "NewPassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "timestamp": "2025-12-04T06:33:00.000Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...],
  "timestamp": "2025-12-04T06:34:00.000Z"
}
```

### Common Error Status Codes:
- `400` - Validation Error
- `401` - Unauthorized (invalid credentials or token)
- `403` - Forbidden (account deactivated)
- `404` - Not Found
- `409` - Conflict (duplicate NIC or username)
- `500` - Internal Server Error

---

## Validation Rules

### Registration Validation:
- **First/Last Name:** Letters only, max 50 characters
- **NIC:** 9 digits + V or 12 digits (Sri Lankan format)
- **Address:** Max 200 characters
- **Phone Number:** International format
- **Company User Name:** 3-30 characters, lowercase, alphanumeric + underscore/hyphen only
- **Password:** Minimum 6 characters, must include uppercase, lowercase, and number

### Login Validation:
- **Username:** Required
- **Password:** Required

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is returned upon successful registration or login and expires in 7 days by default.

---

## Testing with cURL

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "nic": "123456789V",
    "address": "123 Main St",
    "phoneNumber": "+1 555 000 0000",
    "companyName": "Acme Corp",
    "companyUserName": "johndoe",
    "companyAddress": "456 Business Ave",
    "companyPhoneNumber": "+1 555 000 0001",
    "password": "Password123",
    "confirmPassword": "Password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "Password123"
  }'
```

### Get Profile:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```
