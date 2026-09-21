# UTOWN API

Backend для сервиса доставки еды **UTOWN**.

---

# Стек технологий

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- JWT
- bcrypt
- Multer
- Swagger
- Socket.IO

## Frontend

- React
- Vite
- TypeScript
- Axios
- React Router

---

# Установка

Клонировать проект:

```bash
git clone <repository-url>
```

Перейти в папку проекта:

```bash
cd utown-monorepo
```

Установить зависимости:

```bash
npm install
```

---

# Настройка

## Backend

Создать файл:

```
apps/api/.env
```

Заполнить его:

```env
# Server
PORT=3000

# Database
DATABASE_URL=mysql://root:password@localhost:3306/utown

# JWT
ACCESS_TOKEN_SECRET=my_super_secret_key
REFRESH_TOKEN_SECRET=my_refresh_secret

# Uploads
UPLOAD_DIR=uploads

# URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000/api
```

---

## Frontend

Создать файл:

```
apps/web/.env
```

Заполнить его:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# Запуск проекта

## Backend

```bash
cd apps/api
npm run dev
```

Backend будет доступен по адресу:

```
http://localhost:3000
```

---

## Frontend

```bash
cd apps/web
npm run dev
```

Frontend будет доступен по адресу:

```
http://localhost:5173
```

---

# Сборка

## Backend

```bash
npm run build
```

Запуск production:

```bash
npm start
```

---

# Prisma

Создать миграцию:

```bash
npm run prisma:migrate
```

Применить существующие миграции:

```bash
npm run prisma:deploy
```

Сгенерировать Prisma Client:

```bash
npm run prisma:generate
```

Открыть Prisma Studio:

```bash
npm run prisma:studio
```

или

```bash
npx prisma studio
```

---

# Swagger

Установка:

```bash
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express
npm install -D @types/swagger-jsdoc
```

Документация API доступна по адресу:

```
http://localhost:3000/api/docs
```

---

# Авторизация

Реализованы:

- регистрация пользователя;
- подтверждение номера телефона;
- вход в систему;
- JWT Authentication;
- Refresh Token;
- Logout;
- хранение Refresh Token в базе данных;
- хэширование паролей с помощью bcrypt;
- защита маршрутов;
- подтверждение телефона с помощью SMS-кода (Mock SMS Service).

Во время разработки SMS не отправляются на реальный номер телефона.

Код подтверждения выводится в консоль сервера.

Пример:

```text
========================================
📨 SMS SENT

Phone:
996555123456

Verification code:
9031

Expires in 5 minutes
========================================
```

---

# Основные возможности

- JWT Authentication
- Refresh Token
- Phone Verification
- Mock SMS Service
- Swagger Documentation
- Upload API
- Admin Panel
- Restaurant CRUD
- Category CRUD
- Menu CRUD
- Cart
- Orders
- Favorites
- Ratings
- Notifications
- Real-time Notifications (Socket.IO)
- Payments
- Prisma ORM
- MySQL

---

# API

## Auth

| Метод | Endpoint                |
| ----- | ----------------------- |
| POST  | `/api/auth/register`    |
| POST  | `/api/auth/verify-code` |
| POST  | `/api/auth/login`       |
| POST  | `/api/auth/refresh`     |
| POST  | `/api/auth/logout`      |
| POST  | `/auth/resend-code`     |

---

## Admin

| Метод  | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/admin/users`     |
| GET    | `/api/admin/users/:id` |
| POST   | `/api/admin/users`     |
| PATCH  | `/api/admin/users/:id` |
| DELETE | `/api/admin/users/:id` |
| GET    | `/api/admin/orders`    |

---

## Restaurants

| Метод  | Endpoint               |
| ------ | ---------------------- |
| GET    | `/api/restaurants`     |
| GET    | `/api/restaurants/:id` |
| POST   | `/api/restaurants`     |
| PATCH  | `/api/restaurants/:id` |
| DELETE | `/api/restaurants/:id` |

---

## Categories

| Метод  | Endpoint                                   |
| ------ | ------------------------------------------ |
| POST   | `/api/categories/restaurant/:restaurantId` |
| GET    | `/api/categories`                          |
| GET    | `/api/categories/:id`                      |
| PATCH  | `/api/categories/:id`                      |
| DELETE | `/api/categories/:id`                      |

---

## Menu Items

| Метод  | Endpoint                               |
| ------ | -------------------------------------- |
| POST   | `/api/menu-items/category/:categoryId` |
| GET    | `/api/menu-items`                      |
| GET    | `/api/menu-items/:id`                  |
| PATCH  | `/api/menu-items/:id`                  |
| DELETE | `/api/menu-items/:id`                  |

---

## Cart

| Метод  | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/cart`                   |
| POST   | `/api/cart/items`             |
| PATCH  | `/api/cart/items/:menuItemId` |
| DELETE | `/api/cart/items/:menuItemId` |
| DELETE | `/api/cart/clear`             |

---

## Orders

| Метод | Endpoint                 |
| ----- | ------------------------ |
| POST  | `/api/orders`            |
| GET   | `/api/orders`            |
| GET   | `/api/orders/:id`        |
| PATCH | `/api/orders/:id/status` |
| PATCH | `/api/orders/:id/cancel` |

---

## Favorites

| Метод  | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/api/favorites`               |
| GET    | `/api/favorites`               |
| DELETE | `/api/favorites/:restaurantId` |

---

## Ratings

| Метод  | Endpoint                                |
| ------ | --------------------------------------- |
| POST   | `/api/ratings/restaurant/:restaurantId` |
| GET    | `/api/ratings/restaurant/:restaurantId` |
| PATCH  | `/api/ratings/restaurant/:restaurantId` |
| DELETE | `/api/ratings/restaurant/:restaurantId` |

---

## Notifications

| Метод  | Endpoint                      |
| ------ | ----------------------------- |
| GET    | `/api/notifications`          |
| PATCH  | `/api/notifications/:id/read` |
| PATCH  | `/api/notifications/read-all` |
| DELETE | `/api/notifications/:id`      |

---

## Users

| Метод  | Endpoint        |
| ------ | --------------- |
| GET    | `/api/users/me` |
| PATCH  | `/api/users/me` |
| DELETE | `/api/users/me` |

---

## Payments

| Метод | Endpoint                       |
| ----- | ------------------------------ |
| POST  | `/api/payments/order/:orderId` |
| GET   | `/api/payments/order/:orderId` |

---
