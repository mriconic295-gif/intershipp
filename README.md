# KAVACH Cybersecurity Website

React + Vite website with React Router, Supabase authentication/data integration, Tailwind CSS v4 utilities, and the existing custom visual system.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Local development
1. Extract the project ZIP.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and add your Supabase project URL and publishable/anon key.
4. Run `npm run dev`.
5. Run `npm run build` before deployment.

## Supabase environment
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY`

Only the public/publishable key belongs in frontend environment variables. Never put a Supabase service-role key in client code.

## Website Launch Checklist
The `/launch-checklist` route includes a user-checkable launch readiness guide for prerequisites, launch checks, Google/search visibility, share previews, forms/privacy, trust, and post-launch maintenance. Its completion state is local to the current page session and is not stored in Supabase.

## Design update
The existing KAVACH pages remain in place. This update adds a glass pill navbar with a sliding active/hover indicator, responsive login placement, translucent rounded surfaces, softer inputs/cards, and the new checklist page. Existing route names and Supabase auth flow are preserved.
# intershipp
# kavach2
