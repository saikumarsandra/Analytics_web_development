# The Considered Market — Data Layer Spec

**Library:** [Adobe Client Data Layer](https://github.com/adobe/adobe-client-data-layer) (ACDL), loaded from jsDelivr.
**Object:** `window.adobeDataLayer`
**Owner:** Sai Kumar Sandra
**Status:** Foundation shipped (initialization + `page-view`). Remaining events below are specced but not yet wired up — built incrementally, matching how this actually gets rolled out on a real implementation (spec first, then instrument page by page).

This is a genuine data layer spec in the format an analytics engineer would hand to a dev team and QA — not just inline comments in the code. If you're implementing an event, this doc is the source of truth for its name and payload shape; the code should match it, not the other way round.

## Why Adobe Client Data Layer

ACDL is what actually sits between a site and Adobe Experience Platform Launch (Tags) in production — it decouples "what happened on the page" from "what a tag does with it." Rules in Launch bind to `adobeDataLayer` events instead of touching page code directly, so marketing/analytics can add or change tracking without a dev deploy. Using the real library (not a hand-rolled shim) here means the implementation is authentic to how this actually works in the field, not a simplified stand-in.

## Initialization

```html
<!-- in <head>, before anything else -->
<script>window.adobeDataLayer = window.adobeDataLayer || [];</script>
<script src="https://cdn.jsdelivr.net/npm/@adobe/adobe-client-data-layer@2/dist/adobe-client-data-layer.min.js"></script>
```

The plain-array fallback (`window.adobeDataLayer || []`) matters: any page code can `push()` to it immediately, even before the ACDL library itself has finished loading — the library scans the existing array for a backlog and processes it on init. This is the same async-safe pattern GTM's `dataLayer` uses.

`js/data-layer.js` wraps the raw `push()` calls in two small helpers so every event pushed across the site has a consistent shape:

```js
DataLayer.pushEvent(eventName, dataObject)   // pushes { event: eventName, ...dataObject }
DataLayer.pageInfo()                          // returns the standard `page` object for the current page
```

It also auto-fires `page-view` on every page load — that's the one event actually implemented so far.

## Conventions

- **Event names:** kebab-case, past-tense-ish action (`add-to-cart`, not `AddToCart` or `cart_add`)
- **No PII in the clear:** the only "identity" pushed is the demo account's email, and only because this is a fake-data demo store. A real implementation would hash or omit it and gate any personal data behind the same cookie-consent decision this site already collects (see `Store.getCookieConsent()`) — not built into the events yet, but the hook point is `Store.getCookieConsent()`.
- **Reuse core objects:** every event that touches a product reuses the same `product` shape; every event that touches the cart reuses the same `cart` shape. No event invents a one-off structure for data another event already describes.

## Core objects

```ts
page:    { name, category, url, path, referrer, language }
user:    { loggedIn, role, email }               // email only because this is a demo — see note above
product: { id, name, category, price, discount, currency }
cart:    { items: [{ id, name, qty, price }], itemCount, subtotal, discount, total }
order:   { id, total, currency, discountCode, items: [{ id, name, qty, price }] }
form:    { name, id }
component: { name, type, location }               // banner/popup identity
```

## Event catalogue

| Event | Trigger | Fires on | Status |
|---|---|---|---|
| `page-view` | Every page load | All 10 pages | ✅ Implemented |
| `product-view` | PDP finishes rendering | `product.html` | Planned |
| `product-list-view` | PLP/home rail results render | `shop.html`, `index.html` | Planned |
| `add-to-cart` | "Add to cart" clicked | `product.html`, `shop.html`, `index.html`, `cart.html` (recs) | Planned |
| `remove-from-cart` | Remove clicked / qty set to 0 | `cart.html` | Planned |
| `cart-update` | Quantity changed | `cart.html` | Planned |
| `checkout-start` | Checkout page loads with items in cart | `checkout.html` | Planned |
| `purchase` | Order confirmed | `checkout.html` | Planned |
| `search` | Search term entered (debounced) | `shop.html` | Planned |
| `filter-applied` | Category/price filter changed | `shop.html` | Planned |
| `sort-applied` | Sort option changed | `shop.html` | Planned |
| `form-start` | First field focus in a form | Any form | Planned |
| `form-submit` | Successful validated submit | Newsletter, review, notify-restock, checkout, login, profile, admin forms | Planned |
| `form-error` | Validation failure on submit | Any form | Planned |
| `banner-view` | Announcement banner rendered visible | All (when active) | Planned |
| `banner-dismiss` | Banner closed | All | Planned |
| `popup-view` | Exit-intent or scroll popup shown | `cart.html`, `shop.html`, `product.html` | Planned |
| `popup-dismiss` | Popup closed without action | Same | Planned |
| `popup-cta-click` | "Apply code" clicked in popup | Same | Planned |
| `login` | Successful login | `account/login.html` | Planned |
| `logout` | Logout clicked | Any page (header) | Planned |
| `review-submit` | Review posted | `product.html` | Planned |
| `chat-open` | Chat bubble opened | All | Planned |
| `chat-message-sent` | User sends a chat message | All | Planned |
| `admin-product-save` | Admin adds/edits a product | `admin/products.html` | Planned |
| `admin-config-save` | Admin saves banner/popup config | `admin/banners.html` | Planned |

## Payload examples

**`page-view`** (implemented):

```json
{
  "event": "page-view",
  "page": {
    "name": "The Considered Market — Considered essentials for daily life",
    "category": "home",
    "url": "https://.../index.html",
    "path": "/ecommerce-app/index.html",
    "referrer": "",
    "language": "en"
  }
}
```

**`add-to-cart`** (planned):

```json
{
  "event": "add-to-cart",
  "product": { "id": "p09", "name": "Noise-Cancelling Earbuds", "category": "Tech", "price": 119, "discount": 0.25, "currency": "GBP" },
  "quantity": 1,
  "cart": { "itemCount": 3, "subtotal": 214.97 }
}
```

**`form-submit`** (planned):

```json
{
  "event": "form-submit",
  "form": { "name": "newsletter-signup", "id": "newsletter-form" }
}
```

**`popup-view`** (planned):

```json
{
  "event": "popup-view",
  "component": { "name": "promo-popup", "type": "popup", "location": "exit-intent" }
}
```

## Implementation notes for future events

1. Add the payload shape here first, matching an existing core object wherever the data overlaps.
2. Call `DataLayer.pushEvent("event-name", { ... })` from the page's own JS — right next to the existing logic for that action (e.g. `add-to-cart` pushes belong inside `Nav.initAddToCartButtons`, not bolted on separately), so the event can never fire without the action actually happening.
3. Flip the row's status to ✅ Implemented in the table above in the same change.
