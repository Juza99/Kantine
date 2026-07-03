# De Kantine 🎉

A Dutch party game for 2–8 players, each playing on their own phone. Rounds
alternate between a **"That's You"**-style round (everyone answers a question
about one player, then compares) and an **Imposter** round (everyone gets a
statement except one person, who has to blend in). Imposter rounds appear
less frequently than "That's You" rounds.

This repo currently implements the app shell/room system plus the **"That's
You" round type**. The Imposter round type and the alternation between the
two are not built yet.

The "That's You" round mixes three question formats, each drawn from a
built-in bank in `src/data/thatsYouQuestions.ts`:

- **vote** — a prompt about the whole group (e.g. "who'd blow out someone
  else's candles?"); everyone taps another player, votes are tallied and the
  top pick(s) score points
- **guess** — one player privately answers a personal multiple-choice
  question about themselves; everyone else guesses their answer and scores
  points for a correct guess
- **photo** — everyone takes a phone-camera photo for a prompt, revealed
  together in a grid (no scoring, just for laughs)

A game runs 6 rounds, host-paced (the host taps "next round" after each
reveal), ending on a final scoreboard.

Built with React + Vite, TypeScript, Tailwind CSS, Zustand, react-i18next
(Dutch default, English secondary), and [PartyKit](https://www.partykit.io/)
for real-time room sync.

## Project structure

```
src/
  components/   Shared UI (buttons, inputs, language toggle, player list,
                camera capture, ...)
  screens/      Home, create-name, join, lobby, starting, answering, reveal,
                game over
  store/        Zustand store driving which screen is shown and round state
  hooks/        useRoomConnection – owns the PartySocket connection
                (mounted once at the App root) plus sendStart/sendAnswer/
                sendNextRound helpers
  data/         thatsYouQuestions.ts – the vote/guess/photo question bank
  i18n/         react-i18next setup + nl/en translation files
  types/        Shared message/room types (used by both client and server)
party/
  server.ts     PartyKit server: room state, join/leave, host, start, and
                the That's You round loop (question selection, answer
                collection, scoring, reveal)
```

## Running locally

You need two dev servers running at the same time: the PartyKit room server
and the Vite frontend.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

   The default (`VITE_PARTYKIT_HOST=127.0.0.1:1999`) matches PartyKit's local
   dev server, so you shouldn't need to change anything for local dev.

3. In one terminal, start the PartyKit server:

   ```bash
   npm run party:dev
   ```

4. In another terminal, start the Vite dev server:

   ```bash
   npm run dev
   ```

5. Open the printed local URL (e.g. `http://localhost:5173`) on your laptop,
   and the same URL from your phone (use your machine's LAN IP instead of
   `localhost`, e.g. `http://192.168.1.23:5173`) to test with multiple
   players. Everyone must be able to reach both the Vite port and the
   PartyKit port (`1999`) on your network.

## Setting up PartyKit for deployment

The frontend and the PartyKit server deploy separately: the frontend goes to
Vercel, the PartyKit server deploys to PartyKit's own edge platform
(Cloudflare Workers under the hood).

1. Log in to PartyKit (opens a browser to authenticate):

   ```bash
   npx partykit login
   ```

2. Deploy the room server:

   ```bash
   npm run party:deploy
   ```

   This deploys using the `name` in `partykit.json` (`de-kantine`), giving
   you a URL like `de-kantine.<your-partykit-username>.partykit.dev`.

3. Point the frontend at your deployed PartyKit server by setting the
   `VITE_PARTYKIT_HOST` environment variable to that host (no protocol, no
   trailing slash), e.g.:

   ```
   VITE_PARTYKIT_HOST=de-kantine.yourusername.partykit.dev
   ```

Re-run `npm run party:deploy` any time you change `party/server.ts`.

## Deploying to Vercel

This repo includes a `vercel.json` and works with Vercel's zero-config Vite
detection.

1. Import the repo in [Vercel](https://vercel.com/new).
2. Set the `VITE_PARTYKIT_HOST` environment variable in the Vercel project
   settings to your deployed PartyKit host (see above).
3. Deploy. Vercel will run `npm run build` and serve the `dist` folder.

## How the room system works

- **Create game**: generates a random 4-letter room code client-side, then
  connects to a PartyKit room named after that code.
- **Join game**: connects to the PartyKit room matching the entered code.
- The PartyKit server (`party/server.ts`) tracks connected players per room,
  assigns the first player to join as **host**, and reassigns host if they
  disconnect.
- Player joins/leaves are broadcast to everyone in the room instantly, so
  every phone's lobby view updates live.
- The host's "Start" button is disabled until at least 3 players have
  joined. Hitting Start broadcasts a `starting` phase, then the server picks
  a random question and starts round 1.
- Each round, the server waits until every player has submitted an answer
  before revealing results (no timers) and broadcasting updated scores. The
  host taps through to the next round; the game ends after 6 rounds with a
  final scoreboard.

## Scripts

| Command                  | Description                              |
| ------------------------- | ----------------------------------------- |
| `npm run dev`             | Start the Vite dev server                 |
| `npm run party:dev`       | Start the PartyKit server locally          |
| `npm run build`           | Typecheck and build the frontend           |
| `npm run preview`         | Preview the production build locally       |
| `npm run lint`            | Lint the frontend with oxlint              |
| `npm run typecheck:party` | Typecheck the PartyKit server              |
| `npm run party:deploy`    | Deploy the PartyKit server                 |
