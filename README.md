# Mayerfeld Consulting Practicum

![London Fitness Studio deployed website](client/src/assets/images/londonfitnessstudio_deployedsite_screenshot.png)<br>

## Section Content
1. Project Overview
2. Features
3. Technologies Used
4. System Architecture
5. Installation
6. Environment Variables
7. Database
8. Stripe Integration
9. Deployment
10. Testing
11. Future Improvements

## 1. Project Overview

### This full-stack, single-page site is the assignment that I have been given as part of [Mayerfeld Consulting's Front-End Practicum Program](https://www.mayerfeld.consulting/frontend-developer-practicum) in October 2026. The project involves building a front-end website for an imaginary fitness studio / sports centre, which I have named London Fitness Studio.

The site had to obey the following specifications:
- [x] Scaffolded with Vite + React inside the existing repo
- [x] Componentized: header, main content, footer, etc., each their own component
- [x] Tailwind fully wired in, old styles.css removed (the index.css file that remains is essential for the app to function and contains basic root elements)
- [x] Responsive classes rewritten mobile-first (unprefixed: sm:/md:/lg:)
- [x] One real filter on main grid, built with useState
- [x] One small controlled component reused per item (toggle/filter)
- [x] Small, regular commits
- [x] No horizontal scroll on any screen size
- [x] Project split into a client and a server
- [x] Postgres database with defined schema, connected to backend, including orders table
- [x] Secrets stored in .env file that remains uncommitted to Git
- [x] React frontend connects to a working API that reads from the Postgres database
- [x] Authentication: signup, login, sessions - all of which survive a page refresh
- [x] Deployed on a live URL
- [x] Login check (middleware) that blocks checkout for anyone who isn't signed in — every order needs to be tied to a real user
- [x] Checkout route (middleware): looks up the product's real price from the database (not from the browser), creates the order record, and starts a Stripe Checkout Session for it
- [x] Webhook route that Stripe calls back on once a payment actually completes — the only thing allowed to mark an order as "paid" after it has verified payment
- [x] Tested locally with the Stripe CLI, and paid with Stripe's test card (4242 4242 4242 4242, any future date, any CVC)
- [x] "Confirm Purchase" button wired up so that it actually calls checkout route and sends the user to Stripe's hosted checkout page
- [x] Add an order lookup endpoint and success page that confirms the payment went through
- [x] Add real Stripe keys and a webhook endpoint pointed at live URL


## 2. Features

### Services
Users can book the following services using an interactive calendar and time selector:

- Fitness Classes
- Nutrition Counselling
- Wellness Programs
- Zumba Classes

### Facilities
Users can book sessions at the following facilities using an interactive calendar and time selector:

- Gym
- Sauna and Steam Rooms
- Sports Courts
- Swimming Pools

### Memberships
Users can purchase one of three annual membership plans:

- **Basic:** £25 per year
- **Intermediate:** £45 per year
- **Gold:** £70 per year

### Booking Validation
- Users can select a date and time for their bookings.
- Bookings cannot be made on bank holidays in England and Wales.
- Bookings cannot be made outside the centre's opening hours.
- Users receive an explanatory message when attempting to make an invalid booking.

### Shopping Cart
- Users can add services, facilities, and memberships to their shopping cart.
- Users can adjust quantities or remove items before checkout.
- The shopping cart calculates the total cost of selected items.

### User Authentication
- Users can create an account and sign in securely.
- Passwords are securely hashed before being stored in the database.
- Only authenticated users can proceed to checkout.
- Users can sign out of their accounts.

### Stripe Payment Integration
- Stripe Checkout is integrated in test mode to simulate online payments.
- Payments are verified through a Stripe webhook.
- Orders are marked as paid only after successful webhook verification.
- Users are redirected to payment success or cancellation pages.

### User Dashboard
- Authenticated users can access their personal dashboard.
- Users can view their order history and payment statuses.

### Additional Features
- Centre opening times displayed in a dedicated table.
- Contact form for illustrative purposes (no backend submission).
- Responsive layout designed for desktop and mobile devices.


## 3. Technologies Used

- React
- Vite
- Tailwind CSS
- Node.js
- PostgreSQL
- Neon
- Stripe
- Drizzle


## 4. System Architecture

The application follows a client-server architecture, with a React frontend communicating with a Node.js/Express backend through REST API endpoints.

The backend manages authentication, booking validation, order processing, and database operations. Neon PostgreSQL provides persistent storage, while Stripe Checkout handles test-mode payments.

In production, Render hosts the Express application, which also serves the compiled React frontend.

The following diagram illustrates the application's main components and the interactions between them.

```mermaid
flowchart TD
    A["User / Web Browser"]
    B["React Frontend<br/>Vite + Tailwind CSS"]
    C["Express / Node.js Backend"]
    D[("Neon PostgreSQL")]
    E["Stripe Checkout"]
    F["Stripe Webhook"]

    A --> B
    B -->|"API requests /api"| C
    C <-->|"Users, products, orders, sessions"| D
    C -->|"Create Checkout session"| E
    B -->|"Redirect to payment"| E
    E -->|"Payment event"| F
    F -->|"Verified webhook"| C
    E -->|"Success / Cancel redirect"| B

    style A fill:#e0f2fe,stroke:#0284c7,color:#0f172a
    style B fill:#dcfce7,stroke:#16a34a,color:#14532d
    style C fill:#fef3c7,stroke:#d97706,color:#78350f
    style D fill:#f3e8ff,stroke:#9333ea,color:#581c87
    style E fill:#fce7f3,stroke:#db2777,color:#831843
    style F fill:#fce7f3,stroke:#db2777,color:#831843
```


## 5. Installation

### Prerequisites

Before running the application locally, ensure you have the following installed:

- Node.js and npm
- Git
- Access to a PostgreSQL database (the project uses Neon)
- A Stripe account with test-mode API keys

### Clone the Repository

Clone the repository from GitHub:

```bash
git clone https://github.com/dominicsimpson/mayerfeldconsultingpracticum_londonfitnessstudio.git
```

Navigate into the project directory:

```bash
cd mayerfeldconsultingpracticum_londonfitnessstudio
```

### Install Dependencies

From the project's root directory, run:

```bash
npm run install:all
```

This installs the dependencies required by both the React frontend and Express backend.

### Run the Application

From the project's root directory, run:

```bash
npm run dev
```

This starts both the React frontend and Express backend development servers.

Open your browser and navigate to:

**http://localhost:5173/**

The Express backend runs on port `3001`, with Vite proxying API requests to the backend.

### Testing Stripe Payments Locally

To test Stripe Checkout locally, install, and authenticate the Stripe CLI.

Forward Stripe webhook events to the local Express backend:

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Use the webhook signing secret displayed by the Stripe CLI as the `STRIPE_WEBHOOK_SECRET` in your `server/.env` file.

Restart the development server after updating environment variables.

You can then test the payment process using Stripe's test card:

- **Card number:** `4242 4242 4242 4242`
- **Expiry date:** Any valid future date
- **CVC:** Any three digits

Successful payments are verified by the Stripe webhook before the corresponding order is marked as paid in the PostgreSQL database.


## 6. Environment Variables

The application requires several environment variables to connect to the PostgreSQL database, manage user sessions, and process Stripe payments.

A template file, `server/.env.example`, is provided in the repository.

### Local Configuration

Navigate to the `server` directory and copy `.env.example` to a new file named `.env`.

Replace the placeholder values with your own credentials:

```dotenv
DATABASE_URL=postgresql://username:password@hostname/database
SESSION_SECRET=replace_with_a_secure_random_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=development
APP_URL=http://localhost:5173
```

### Environment Variable Descriptions

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Connection string for the Neon PostgreSQL database |
| `SESSION_SECRET` | Secret used to sign and protect user sessions |
| `STRIPE_SECRET_KEY` | Stripe API secret key used to create Checkout sessions |
| `STRIPE_WEBHOOK_SECRET` | Signing secret used to verify incoming Stripe webhook events |
| `NODE_ENV` | Determines whether the application runs in development or production mode |
| `APP_URL` | Base URL used for Stripe payment success and cancellation redirects |

### Security

The `.env` file contains sensitive credentials and must never be committed to GitHub.

The `.env.example` file contains placeholder values only and is included in the repository to help other developers configure the application.

For production deployment on Render, environment variables are configured securely through the Render dashboard rather than stored in the repository.


## 7. Database

The application uses **PostgreSQL**, hosted on **Neon**, to store and manage user accounts, products, orders, sessions, and payment information.

The Express backend communicates with PostgreSQL using the `pg` (node-postgres) library. Drizzle ORM and Drizzle Kit are used for database schema management.

### Database Tables

The application uses five main database tables:

| Table | Description |
|---|---|
| `users` | Stores registered user information, including names, email addresses, and securely hashed passwords. |
| `products` | Stores available services, facilities, and membership plans, including descriptions, categories, and prices. |
| `orders` | Stores customer details, order totals, payment statuses, and Stripe Checkout session identifiers. |
| `order_items` | Stores individual products associated with each order, including quantities, prices, and booking dates and times. |
| `user_sessions` | Stores server-side session information, allowing users to remain authenticated between requests. |

### Table Relationships

- Each registered user can have multiple orders.
- Each order can contain multiple order items.
- Each order item references a product in the `products` table.
- The `orders` table references the `users` table through `user_id`.
- The `order_items` table references the `orders` and `products` tables through foreign keys.

### Order Management

When an authenticated user proceeds to checkout:

1. The Express backend validates the submitted customer information and shopping cart items.
2. Product prices are retrieved directly from PostgreSQL to prevent price manipulation on the frontend.
3. An order is created in the `orders` table with an initial payment status of `pending_payment`.
4. The corresponding products, quantities, prices, and booking details are saved in `order_items`.
5. A Stripe Checkout session is created and its identifier is associated with the order.
6. Once Stripe confirms successful payment through a verified webhook, the order's payment status is updated to `paid`.

This ensures that orders are only marked as paid following verified payment confirmation from Stripe.

### Data Security and Integrity

- User passwords are stored as secure password hashes rather than plaintext.
- Database credentials are stored in environment variables.
- Foreign key constraints maintain relationships between orders, users, and products.
- Database transactions are used when creating orders and their associated order items.
- Product prices are validated on the server rather than trusted from the client.
- User sessions are stored in PostgreSQL rather than relying on in-memory session storage.

### Database Hosting

The PostgreSQL database is hosted on Neon and accessed by the Express backend.

In production, the application is deployed on Render, with the database connection configured through the `DATABASE_URL` environment variable.


## 8. Stripe Integration

The application integrates **Stripe Checkout** to process payments securely in test mode. This was my first project using it.

Users can purchase memberships and book services or facilities through the shopping cart. Payments are processed using Stripe's hosted Checkout page, while the Express backend manages order creation, payment verification, and database updates.

### Payment Process

1. **Checkout:** An authenticated user selects products, adds them to their shopping cart, and proceeds to checkout.
2. **Order validation:** The Express backend validates the customer's details, selected products, quantities, and booking information. Product prices are retrieved directly from the PostgreSQL database.
3. **Order creation:** A new order is created in the `orders` table with a payment status of `pending_payment`. The corresponding products are saved in `order_items`.
4. **Stripe Checkout session:** The backend creates a Stripe Checkout session and associates its identifier with the order.
5. **Payment:** The user is redirected to Stripe's hosted Checkout page to complete the payment using a test card.
6. **Webhook verification:** Stripe sends a webhook event to the Express backend when payment is completed. The webhook signature is verified using the configured `STRIPE_WEBHOOK_SECRET`.
7. **Database update:** Following successful webhook verification and payment confirmation, the order's `payment_status` is updated to `paid`.
8. **Payment confirmation:** The user returns to the application, where the success page displays the order number, payment amount, and payment status.

### Payment Security

The integration includes several measures to protect payment and order information:

- **Server-side price validation:** Product prices are retrieved from PostgreSQL rather than trusted from the frontend.
- **Stripe-hosted Checkout:** Payment card information is entered on Stripe's hosted payment page rather than collected or stored by the application.
- **Webhook signature verification:** Incoming Stripe webhook events are authenticated before payment statuses are updated.
- **Payment status management:** Orders are initially recorded as `pending_payment` and are only marked as `paid` after verified payment confirmation.
- **Environment variables:** Stripe API keys and webhook signing secrets are stored outside the source code.

### Payment Success and Cancellation

**Successful payments:**
- Users are redirected to a success page displaying their order number and payment confirmation.
- The corresponding order is marked as `paid` in PostgreSQL following webhook verification.
- The shopping cart is cleared after successful checkout.
- The completed order can be viewed in the user's dashboard.

**Cancelled payments:**
- Users are redirected to a cancellation page.
- The shopping cart contents are preserved.
- The order remains recorded as `pending_payment` unless its status is subsequently updated.

### Stripe Test Mode

The application uses Stripe's test environment. No real money is transferred.

The payment process can be tested using the following Stripe test card:

| Field | Test Value |
|---|---|
| Card number | `4242 4242 4242 4242` |
| Expiry date | Any valid future date |
| CVC | Any three digits |
| Postcode | Any valid postcode |

### Production Deployment

The application is deployed on Render and connected to a Neon PostgreSQL database.

Stripe's test-mode webhook endpoint is configured to send payment events to the deployed Express backend.

The Stripe secret key and webhook signing secret are configured securely through Render's environment variables.

This allows the complete test payment process to be demonstrated on the deployed application, including checkout, webhook verification, database updates, and payment confirmation.


## 9. Deployment

The application is deployed on **Render** and connected to a **Neon PostgreSQL** database.

- **Deployed application:** https://londonfitnessstudio.onrender.com
- **API health check:** https://londonfitnessstudio.onrender.com/api/health
- **Products API:** https://londonfitnessstudio.onrender.com/api/products

### Hosting and Infrastructure

- **Render:** Hosts the Express backend and serves the production build of the React frontend.
- **Neon:** Hosts the PostgreSQL database containing users, products, orders, and session data.
- **Stripe:** Processes test-mode payments through Stripe Checkout and sends webhook events to the deployed backend.

### Deployment Configuration

The application is deployed as a Render Web Service.

During deployment:

1. The project dependencies are installed.
2. Vite builds the React frontend for production.
3. Express starts the backend server and serves the compiled frontend.
4. The backend connects to the Neon PostgreSQL database using the `DATABASE_URL` environment variable.
5. Stripe Checkout and webhook verification use credentials configured in Render's environment settings.

Sensitive credentials, including database passwords, session secrets, and Stripe API keys, are stored as environment variables rather than committed to GitHub.

### Production Payment Testing

The deployed application supports the complete Stripe test-mode payment process.

Users can create an account, add products to their shopping cart, complete a simulated payment through Stripe Checkout, and view the resulting order in their dashboard.

Successful payments are verified through Stripe webhooks before the corresponding orders are marked as paid in PostgreSQL.


## 10. Testing

The application has been manually tested in both the local development environment and the deployed Render environment to verify its core functionality.

### User Authentication

- Verified that users can register with valid account details.
- Verified that registered users can sign in and sign out.
- Confirmed that authenticated sessions are maintained across requests.
- Verified that unauthenticated users cannot proceed to checkout.
- Confirmed that authenticated users can access their order history through the dashboard.

### Booking Validation

- Tested date and time selection for services and facilities.
- Verified that bookings cannot be made on bank holidays in England and Wales.
- Verified that bookings cannot be made outside the centre's opening hours.
- Confirmed that invalid booking attempts display explanatory messages.
- Verified that memberships can be purchased without selecting a booking date or time.

### Shopping Cart

- Tested adding services, facilities, and memberships to the shopping cart.
- Verified that quantities can be increased and decreased.
- Confirmed that individual items can be removed.
- Verified that the shopping cart calculates the total price of selected items.
- Confirmed that the shopping cart is cleared following successful payment.
- Verified that cart contents are preserved when a payment is cancelled.

### Stripe Payment Integration

The complete Stripe Checkout process has been tested in test mode, both locally and on the deployed Render application.

The following scenarios have been verified:

| Test Scenario | Expected Result |
|---|---|
| Successful Stripe test payment | Payment completes and the user returns to the success page |
| Webhook verification | Stripe webhook verifies the payment and updates the database |
| Successful order | Order status changes from `pending_payment` to `paid` |
| Payment cancellation | User returns to the cancellation page without completing payment |
| Cancelled order | Order remains recorded as `pending_payment` |
| Successful checkout | Shopping cart is cleared |
| Cancelled checkout | Shopping cart contents are preserved |
| Order history | Completed orders can be viewed in the user's dashboard |

### Database Verification

The Neon PostgreSQL database was inspected using SQL queries to verify that:

- Orders are created with the correct customer details and total prices.
- Each order is associated with its corresponding records in `order_items`.
- Stripe Checkout session identifiers are stored against orders.
- Payment statuses are updated following verified Stripe webhook events.
- Cancelled payments do not incorrectly mark orders as paid.

### Deployment Testing

The deployed application was tested on Render to confirm that:

- The React frontend loads successfully.
- The Express backend responds to API requests.
- The application can retrieve products from Neon PostgreSQL.
- User authentication and session management work in the deployed environment.
- Stripe Checkout and webhook verification function correctly in test mode.

### Testing Approach

Testing has primarily been performed manually through the browser, alongside API responses, server logs and SQL queries in Neon.

Automated unit and integration testing could be introduced in future development to provide more comprehensive regression testing.


## 11. Future Improvements

Due to the time constraints of the Bootcamp, the application focuses on delivering its core functionality, including user authentication, bookings, shopping cart management, and Stripe payment integration.

Given additional development time, the following improvements could be implemented.

### More Detailed Booking Options

The current booking system allows users to reserve services and facilities, but could offer more granular booking options.

For example:

- **Swimming facilities:** Separate bookings for the main swimming pool, children's pool, and swimming lessons.
- **Fitness classes:** A wider selection of specific classes, including weight loss programmes, strength training, yoga, and other specialised activities.
- **Wellness programmes:** More detailed descriptions and booking options for individual wellness activities.
- **Lessons and coaching:** Dedicated booking options for swimming lessons, personal training, and other instructor-led sessions.

### Community Events and Concessions

The website could provide more information about community activities and inclusive fitness opportunities, including:

- A dedicated calendar of health and wellbeing events.
- Activities specifically designed for children, families, and older adults.
- Concessionary membership rates for eligible groups, including children and people aged over 60.
- Community-focused fitness programmes and initiatives.

### Interactive Site Map

A real fitness centre website would benefit from an interactive site map, allowing visitors to locate facilities such as swimming pools, gyms, sports courts, changing rooms, and reception areas.

This could also improve accessibility by helping visitors plan their journeys around the centre.

### News and Events Section

A dedicated News section could provide updates about:

- Upcoming events and fitness programmes.
- Changes to opening hours.
- New facilities and services.
- Community initiatives and special offers.

### Mention of community enterprise origins and charitable status in an About Us section

This would help anchor the centre in its local community.

### Website Search Functionality

A search bar could be introduced to help users quickly locate specific facilities, services, membership options, and other information across the website.

### Automated Testing

Although the application's main functionality has been manually tested, future development could include automated unit, integration and end-to-end tests to improve reliability and reduce the risk of regressions.

### Accessibility

I was not able to conduct an accessibility audit against WCAG 2.2 guidelines due to time constraints.



Thank you for reading.