# Mayerfeld Consulting Practicum

<img width="1920" height="869" alt="londonfitnessstudio_screenshot" src="https://github.com/user-attachments/assets/4e7af53e-3dec-4727-981e-e02b71c28758" />
<br>
<br>
This full-stack, single-page site is the assignment that I have been given as part of [Mayerfeld Consulting's Front-End Practicum Program](https://www.mayerfeld.consulting/frontend-developer-practicum) in October 2026. The project involves building a front-end website for an imaginary fitness studio, which I have named London Fitness Studio.

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

## Deployment & Hosting

This project is deployed on Render, and is connected to a Neon PostgreSQL database.

- Deployed site: https://londonfitnessstudio.onrender.com
- API Health Check: https://londonfitnessstudio.onrender.com/api/products
















