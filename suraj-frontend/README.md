# Suraj — Personal AI Assistant (Frontend)

Plain HTML / CSS / JavaScript. No build step, no framework, no npm install.

## Folder structure

```
suraj-frontend/
├── index.html              → page structure (home screen + chat screen)
├── css/
│   └── styles.css          → all styling
├── js/
│   ├── stars.js             → interactive canvas star field
│   ├── magnetic-text.js     → hover-reactive headline/subtitle letters
│   ├── navigation.js        → home nav scroll, sun-click → chat transition, mobile sidebar
│   └── chat.js              → chat screen logic (send, thinking spinner, demo replies)
├── assets/
│   └── resume/              → put resume.pdf / resume.docx here
└── README.md
```

The JS files load in this order (see the bottom of `index.html`) and share
a few global variables (`mouse`, `reduceMotion`) between them, so keep the
order as-is if you edit the `<script>` tags:

```html
<script src="js/stars.js"></script>
<script src="js/magnetic-text.js"></script>
<script src="js/navigation.js"></script>
<script src="js/chat.js"></script>
```

## Running it

Just open `index.html` in a browser — double-click it, or right-click →
"Open with" → your browser. No server required for the frontend itself.

## Connecting a real backend

Open `js/chat.js` and find the `handleSend()` function — there's a `NOTE`
comment marking exactly where the demo reply logic lives. Replace that
block with a `fetch()` call to your backend's chat endpoint.

## Adding your resume

Drop `resume.pdf` and/or `resume.docx` into `assets/resume/` (see the
README.txt in that folder). The download buttons in the Resume section
of `index.html` already point there.

## Adding your projects

In `index.html`, find the Projects section (`<section class="page-section" id="projects">`).
Each `<a class="project-card">` is one project card — update the `href`,
title, description, and tags for your own work.
