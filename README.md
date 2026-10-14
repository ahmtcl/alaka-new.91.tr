This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Contact email configuration

Copy `.env.example` to `.env.local` and set `SMTP_PASS` to the mailbox password. The contact API sends from `SMTP_USER` (`alaka@91.com.tr`) through `mail.91.com.tr:587` with STARTTLS. `CONTACT_RECEIVER_EMAIL` defaults to `alaka@alakamedia.com`; the visitor's email is used as Reply-To.

On Vercel, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_RECEIVER_EMAIL` in the project's Production environment and redeploy. `.env.local` is ignored by Git and is not uploaded through a Git deployment. Keep the password in server-side environment variables, never in a `NEXT_PUBLIC_` variable.

Enter only the value in each Vercel field (not `SMTP_PASS=...`). Outer whitespace and one matching pair of literal quotes are removed from SMTP settings. If sending fails, the runtime log `Mail gönderme hatası` includes the SMTP server response, selected host/port/user, and names of normalized settings; passwords and authentication tokens are redacted. `EAUTH` with response code `535` indicates that SMTP authentication was rejected. Run the configuration checks with `node --experimental-strip-types --test scripts/smtp-config.test.mjs`.

The form also requires a file upload. Configure `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`, and `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` for the upload endpoint; its Firebase setup is independent of SMTP.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
