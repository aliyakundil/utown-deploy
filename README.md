# UTOWN API

Backend для сервиса доставки еды UTOWN.

## Стек технологий

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- JWT
- Multer

## Установка

```bash
npm install
```

## Настройка

Создать файл `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

## Запуск

```bash
npm run dev
```

## Сборка

```bash
npm run build
```

## Production

```bash
npm run start
```

## Prisma

Создать миграцию

```bash
npm run prisma:migrate
```

# Установка Express

npm install express cors helmet express-rate-limit multer dotenv morgan bcrypt
npm install socket.io
npm install swagger-ui-express
npm install jsonwebtoken;

# Установка зависимостей TypeScript

npm install --save-dev typescript ts-node nodemon @types/node @types/express @types/morgan
npm install -D @types/jsonwebtoken
npm install -D @types/bcrypt

````

Сгенерировать Prisma Client

```bash
npm install prisma @prisma/client@6.11.1
npm run prisma:generate
````

Открыть Prisma Studio

```bash
npm run prisma:studio
```

## API

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- GET /api/auth/me
- DELETE /api/auth/me

### Admin

- GET /api/admin/users
- GET /api/admin/users/:id
- POST /api/admin/users
- PATCH /api/admin/users/:id
- DELETE /api/admin/users/:id

### Restaurants

- GET /api/restaurants
- GET /api/restaurants/:id
- POST /api/restaurants
- PATCH /api/restaurants/:id
- DELETE /api/restaurants/:id

### Categories

- POST /api/categories/restaurant/:restaurantId
- GET /api/categories
- GET /api/categories/:id
- PATCH /api/categories/:id
- DELETE /api/categories/:id

### Menu Items

- POST /api/menu-items/category/:categoryId
- GET /api/menu-items
- GET /api/menu-items/:id
- PATCH /api/menu-items/:id
- DELETE /api/menu-items/:id

### Cart

- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/:menuItemId
- DELETE /api/cart/items/:menuItemId
- DELETE /api/cart/clear

### Orders

- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PATCH /api/orders/:id/status
- DELETE /api/orders/:id

### Favorites

- POST /api/favorites
- GET /api/favorites
- DELETE /api/favorites/:restaurantId

### Ratings

- POST /api/ratings/restaurant/:restaurantId
- GET /api/ratings/restaurant/:restaurantId
- PATCH /api/ratings/restaurant/:restaurantId
- DELETE /api/ratings/restaurant/:restaurantId

### Notifications

- GET /api/notifications
- PATCH /api/notifications/1/read
- PATCH /api/notifications/read-all
- DELETE /api/notifications/1

### Users

- GET /api/users/me
- PATCH /api/users/me
- DELETE /api/users/me

### Payments

- POST /api/payments/order/:orderId
- GET /api/payments/order/:orderId
- PATCH /api/payments/order/:orderId

### Uploads

#### Installation

```bash
npm install multer
npm install -D @types/multer
```

#### Endpoints

- POST /api/uploads
- GET /api/uploads
- GET /api/uploads/:id
- DELETE /api/uploads/:id
