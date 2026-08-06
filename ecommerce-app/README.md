# The Considered Market

A full ecommerce storefront — home page, product listing, product detail, cart and checkout — built from scratch in **plain HTML, CSS and JavaScript**, with no framework and no build step.

## Why this exists

This is a personal training project, built a little at a time on my own time, to sharpen exactly the UI patterns that show up constantly in Adobe Target / CRO work: **forms, popups and banners**. Rather than a set of isolated demo widgets, it's built as a realistic multi-page storefront so those patterns show up in a real product context — validated forms, an exit-intent discount popup, a dismissible announcement banner, a cookie-consent flow, and an admin-configurable promo system.

## Features

- **Home** (`index.html`) — dismissible announcement banner, hero, an animated "brand story" section (scroll-reveal + word-cycling, respects `prefers-reduced-motion` with a manual preview override), and Amazon-style category rails covering the full catalogue
- **Shop** (`shop.html`) — live search, category and price filters, sorting, and a result count — all client-side
- **Product detail** (`product.html?id=...`) — gallery, quantity + add-to-cart, "you may also like" recommendations, a review feed with a working "write a review" feedback form, and a **notify-me-when-back-in-stock** form for out-of-stock items
- **Cart** (`cart.html`) — quantity editing, discount codes, "frequently bought together", and an exit-intent popup offering a discount when a visitor tries to leave with items still in their cart
- **Checkout** (`checkout.html`) — validated shipping/payment form (demo only — no real payment is processed) with an order confirmation modal
- Site-wide cookie consent, auth-aware navigation (mock login), and a persistent cart/session/order layer

## Tech approach

- **No framework, no build step** — deploys as-is to GitHub Pages or any static host
- **No backend** — all state (cart, orders, reviews, restock subscriptions, admin edits, login session) lives in `localStorage` via a single data-layer module (`js/store.js`)
- Every form does real client-side validation with inline error states — nothing is a silent no-op
- Every modal/popup is accessible: `role="dialog"`, focus-trapped, closes on <kbd>Escape</kbd>
- Mobile-first, responsive throughout

## Project structure

```
ecommerce-app/
├── index.html, shop.html, product.html, cart.html, checkout.html
├── css/
│   ├── style.css        — design tokens, layout, header/footer, buttons, forms
│   └── components.css   — hero, product cards, modals, PLP/PDP/cart/checkout layouts
├── js/
│   ├── data.js           — mock product catalogue + demo accounts
│   ├── store.js           — localStorage data layer (cart, orders, session, reviews, config)
│   ├── utils.js            — focus-trap, exit-intent, countdown, toast, debounce helpers
│   ├── nav.js               — shared header/footer behaviour, product card renderer
│   ├── home.js, shop.js, product.js, cart.js, checkout.js  — one file per page
│   └── brand-story.js        — scroll-reveal + word rotation for the home page
```

## Running it locally

No install, no build. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static server (e.g. VS Code's Live Server extension) for auto-reload

Demo login: `admin@demo.com` / `user@demo.com`, any password.

## What's next

Account pages (login/profile) and an admin area (product management, banner/popup configuration) are the remaining pieces of the original plan — built incrementally, a page or two at a time.

Built by [Sai Kumar Sandra](https://github.com/saikumarsandra).
