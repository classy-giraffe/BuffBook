# BuffBook 💪

**BuffBook** is an open-source, evidence-based hypertrophy wiki and custom training plan platform. It serves as both a comprehensive educational resource for science-based muscle growth and a full-stack platform for requesting, managing, and delivering personalized training plans.

Built with performance, security, and a beautiful dark-mode UI in mind.

## 🚀 Features

- **Hypertrophy Wiki:** An extensive, meticulously interlinked library (built with Astro Starlight) covering the biological mechanisms of muscle growth, exercise selection, periodization, and nutrition.
- **Custom Plan Requests:** A sleek, interactive application flow for users to request highly personalized training programs.
- **Admin Dashboard:** A secured internal dashboard (protected via Cloudflare Access) to manage incoming requests, track orders, and upload customized plans directly to cloud storage.
- **Secure Authentication:** User accounts and login flows powered by [Better Auth](https://better-auth.com/).
- **Edge Architecture:** Fully serverless backend relying on Cloudflare D1 (SQL Database) and Cloudflare R2 (Object Storage).

## 🛠️ Technology Stack

- **Framework:** [Astro v6](https://astro.build/) (with the Starlight template)
- **UI & Components:** React, Tailwind CSS, and [shadcn/ui](https://ui.shadcn.com/)
- **Database:** Cloudflare D1 (via [Drizzle ORM](https://orm.drizzle.team/))
- **Storage:** Cloudflare R2
- **Authentication:** Better Auth
- **Deployment:** Cloudflare Workers / Pages

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- npm
- Cloudflare Wrangler CLI (`npm i -g wrangler`)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/buffbook.git
   cd buffbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Duplicate the `.env.example` file (or create a `.env` file) and provide the required secrets:
   ```env
   # Local Development Database URL (Optional depending on D1 setup)
   DATABASE_URL=file:./local.db

   # Admin Email (Must match the email you intend to use for the admin account)
   ADMIN_EMAIL=your.admin@email.com
   ```

4. **Initialize the Database:**
   ```bash
   npx wrangler d1 migrations apply buffbook_db --local
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`.

## 🛡️ Admin Setup & Security

The admin dashboard (`/admin`) is designed to be protected by a **Cloudflare Access Zero-Trust Tunnel** in production. 

To initialize the admin account:
1. Ensure your `ADMIN_EMAIL` is set in your environment variables and Cloudflare secrets.
2. In production, Cloudflare Access will block unauthorized users from reaching the setup page.
3. Visit `/admin/setup` to securely hash and register your admin password.
4. Future logins are handled normally through `/login`. (The backend strictly prevents unauthorized public signups from claiming the `ADMIN_EMAIL`).

## 📚 Contributing

The core content of BuffBook lives in `src/content/docs/`. If you're a fitness professional or enthusiast looking to contribute evidence-based corrections or additions to the wiki, feel free to submit a Pull Request!

When adding new content, please review the internal linking structure to ensure new concepts are properly interlinked with the existing topic dictionary.

## 📝 License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike License (CC BY-NC-SA 4.0).
