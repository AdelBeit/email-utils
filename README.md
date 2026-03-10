# Email Finder

good for guessing emails and doing a quick & dirty validation.

## Running locally

1. Run `yarn` then `yarn dev` (server starts at http://localhost:3001/ and automatically tries the next port if 3001 is unavailable).
2. Open that URL in your browser, fill the form, and hit **Find** to generate + verify email guesses.

## CLI helper

`node lib/emailfinder.js First Last domain.com` will print every permuted address and a verified subset (mirrors what the server does). This is handy for scripting or quick checks without running the full UI/API stack.
