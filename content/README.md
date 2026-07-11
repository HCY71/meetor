# Content

Every piece of user-facing text and every outbound link lives here. Behavior
(themes, time logic, defaults) does NOT — that stays in `lib/`, `public/theme`,
and the components.

## Structure

Every section is a folder with a `schema.js` describing the shape of its data,
plus the data itself:

- **Localized sections** (`about/`, `home/`, `event/`, `notFound/`,
  `eventNotFound/`, `global/`) have one file per language: `en.js` and
  `zh-tw.js`. Both are validated against the same `schema.js`, so a field
  missing from one translation fails the build with the exact field path.
- **Language-independent sections** (`seo/`, `author/`) have a single
  `content.js`.

`index.js` imports all sections, validates each one, and is the ONLY module
the rest of the app reads content from:

- Components get localized text through `useLang()` (unchanged) — the
  `/api/static` route serves `contentByLanguage[lang]` from here.
- `seo` and `author` are imported directly
  (`import { seo, author } from "@/content"`).

| Section          | What it holds                                        |
| ---------------- | ---------------------------------------------------- |
| `home/`          | Landing page header, description, form labels        |
| `event/`         | Event page greeting, form labels, export button      |
| `about/`         | About page copy and the how-to-use steps             |
| `notFound/`      | 404 page                                             |
| `eventNotFound/` | Missing-event page                                   |
| `global/`        | Buttons, settings, toasts, panel tabs, tips, updates |
| `seo/`           | Page title, meta description, share image            |
| `author/`        | Author name, role, email, links on the about page    |

## How to edit

Change values in the section's language file (`en.js` / `zh-tw.js`) — always
change both languages. Do not add new fields — unknown fields fail validation.
If you need a new field, add it to that section's `schema.js` first, then wire
it up in the component that renders it.

Validation runs automatically: `npm run dev` (or `npm run build`) throws with
the exact path of any invalid field, e.g.
`Content error at zh-tw.global.toast.saved: expected a non-empty string`.

## Field type tokens used in schemas

- `"string"` — required non-empty string
- `"string?"` — optional string (may be absent or empty)
- `"string[]"` — array of strings
- `"a|b"` — must be exactly `a` or `b`
- `[shape]` — array of objects matching `shape`
