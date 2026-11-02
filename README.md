# Mayerfeld Consulting Practicum

<img width="1920" height="869" alt="londonfitnessstudio_screenshot" src="https://github.com/user-attachments/assets/4e7af53e-3dec-4727-981e-e02b71c28758" />
<br>
<br>

## Project Overview

### This full-stack, single-page site is the assignment that I have been given as part of [Mayerfeld Consulting's Front-End Practicum Program](https://www.mayerfeld.consulting/frontend-developer-practicum) in October 2026. The project involves building a front-end website for an imaginary fitness studio, which I have named London Fitness Studio.

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

## Features

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
- Bookings cannot be made on UK bank holidays (England and Wales).
- Bookings cannot be made outside the centre's opening hours.
- Users receive an explanatory message when attempting to make an invalid booking.

### Shopping Cart
- Users can add services, facilities and memberships to their shopping cart.
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

## Technologies Used

- React
- Vite
- Tailwind CSS
- Node.js
- PostgreSQL
- Neon
- Stripe
- Drizzle

## Installation



## Deployment & Hosting

This project is deployed on Render, and is connected to a Neon PostgreSQL database.

- Deployed site: https://londonfitnessstudio.onrender.com
- API Health Check: https://londonfitnessstudio.onrender.com/api/products

## Architecture Overview














