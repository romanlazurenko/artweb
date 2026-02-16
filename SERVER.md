# Running ArtWeb Locally (with contact form)

The contact form uses **PHP** to send emails. Tools like **Live Server** (port 5500) only serve static files and do **not** run PHP, so the form will return **405 Method Not Allowed** when you submit.

## Use PHP’s built‑in server

1. Open a terminal in this project folder.
2. Run:
   ```bash
   php -S localhost:8000
   ```
3. In your browser open: **http://localhost:8000**
4. Submit the contact form; it will POST to `send-email.php` and PHP will run correctly.

Stop the server with `Ctrl+C`.

## Production

Upload the site to any **PHP‑enabled hosting** (e.g. shared hosting). The same `send-email.php` will work there; no extra setup is needed for the form.
