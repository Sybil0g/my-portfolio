# Alexis — Portfolio

React + TypeScript + Vite + Tailwind CSS + React Router, with Firebase (Firestore + Auth) as the backend and an `/admin` dashboard to manage your projects. Deploys as a single site to Vercel.

**On images:** Firebase Cloud Storage now requires the paid Blaze plan even for free-tier usage, so this project does NOT use Firebase Storage. Instead, you upload your screenshots to a free image host (e.g. [imgbb.com](https://imgbb.com) — no account needed) and paste the resulting link into the admin form. Firestore (your projects database) and Auth (your login) both stay on Firebase's free Spark plan — no card needed anywhere in this setup.

## Pages

| Route | What it is |
|---|---|
| `/` | Landing page (hero + featured projects + Download Resume) |
| `/about` | About me |
| `/skills` | Skills, grouped |
| `/projects` | Grid of all projects (public) |
| `/projects/:id` | One project's own page — click any project card to get here |
| `/contact` | Contact info + Download Resume |
| `/admin/login` | Sign in (only for you) |
| `/admin` | Dashboard: add / edit / delete projects (protected — redirects to login if not signed in) |

---

## 1. Where you edit things

- **Your text (name, bio, skills list, contact info, resume link):** `src/data/siteContent.ts` — one file, plain object, well commented. Change it, no other files need touching.
- **Your resume file:** drop your PDF into `public/resume.pdf` (exact filename). The Download Resume buttons on Landing and Contact already point here.
- **Your projects (title, description, images, tech stack, links):** NOT edited in code. Once the site is live, go to `/admin`, sign in, and add/edit/delete them there — they're stored in Firestore and show up on `/projects` and the landing page instantly, no redeploy needed.
- **Project images:** upload each screenshot to [imgbb.com](https://imgbb.com) (no account needed — drag the image in, it gives you a direct link), then paste that link into the "Thumbnail image URL" or "Gallery images" field in the admin form. You can add as many gallery images per project as you want, one URL per line — they show up as a tap-to-view carousel on that project's page, with next/previous and zoom.
- **Your photo on the landing page:** currently a placeholder box in `src/pages/Landing.tsx` (search for "add your photo here") — replace that block with an `<img>` tag pointing at a photo you add to `/public`.
- **Colors / fonts:** `tailwind.config.js` (colors, font families) and the Google Fonts `<link>` in `index.html`.

---

## 2. Setting up Firebase (one-time, ~10 minutes)

Firebase is your backend — a database (Firestore) and login (Auth), both hosted by Google, both free on the Spark plan. You don't deploy Firebase yourself; you just configure it once in the browser, and your React app (deployed to Vercel) talks to it directly.

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it whatever you like → finish the wizard. Stay on the free **Spark** plan — nothing here needs Blaze.
2. **Enable Firestore**: left sidebar → Build → Firestore Database → Create database → start in **production mode** → pick a region.
3. **Enable Auth**: left sidebar → Build → Authentication → Get started → enable the **Email/Password** provider.
4. **Create your admin user**: still in Authentication → Users tab → Add user → enter the email/password YOU will use to log into `/admin`. (This is the only account that will ever exist — there's no public sign-up.)
5. **Get your config**: ⚙️ Project settings (top left) → scroll to "Your apps" → click the `</>` (web) icon → register an app (no need for Firebase Hosting) → copy the `firebaseConfig` values.
6. Copy `.env.example` to `.env` and paste those values in:
   ```
   cp .env.example .env
   ```
7. **Publish the Firestore security rules** (so only you can write, everyone can read): Firestore Database → Rules tab → paste in the contents of `firestore.rules` from this repo → Publish.

That's it — no server, no separate deployment for Firebase. It's just a live backend sitting there. (`storage.rules` is included in this repo but not needed unless you later upgrade to Blaze and want to use Firebase Storage instead of image links.)

---

## 3. Running locally

```bash
npm install
npm run dev
```

Visit the printed local URL. Sign in at `/admin/login` with the admin user you created in step 5 above.

---

## 4. Deploying to Vercel

You only deploy **one thing**: this React app. Firebase needs no separate deploy.

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import that repo.
3. Vercel auto-detects Vite — defaults are fine (`npm run build`, output dir `dist`).
4. Before deploying, add your environment variables: Project Settings → Environment Variables → add each one from `.env.example` (same values as your local `.env`).
5. Deploy. Done — you get a live URL, and `vercel.json` is already set up so client-side routing (`/projects/:id`, `/admin`, etc.) works correctly on refresh.

Any time you push to GitHub, Vercel redeploys automatically. Changes you make through `/admin` (adding/editing/deleting projects) do **not** need a redeploy — they show up live immediately since they come from Firestore.

---

## 5. Project structure

```
src/
  components/     Navbar, Footer, ProjectCard, ResumeButton, ProtectedRoute
  context/        AuthContext (tracks whether you're signed in as admin)
  data/           siteContent.ts — EDIT THIS for your text/bio/contact info
  firebase/       config.ts — Firebase initialization (uses your .env values)
  lib/            projects.ts (Firestore CRUD); storage.ts is unused unless you upgrade to Blaze
  pages/          Landing, About, Skills, Projects, ProjectDetail, Contact
  pages/admin/    AdminLogin, AdminDashboard, ProjectForm
firestore.rules    Firestore security rules (who can read/write projects)
storage.rules      Storage security rules (who can upload/view images)
```

## Notes

- If you ever forget your admin password, reset it from Firebase Console → Authentication → Users.
- The `/admin` link is a quiet text link in the footer — feel free to remove it from `src/components/Footer.tsx` once you have the URL memorized, since it doesn't need to be public-facing.
