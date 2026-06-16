# jd-laurence-intro26.2
Intro to Programming course with Code the Dream
John-Daniel Laurence

# World Cup 2022 Checker

A webpage that uses the API-Football API to display Qatar 2022 World Cup results by team.

## Setup

1. Get a free API key from [dashboard.api-football.com](https://dashboard.api-football.com/register)
2. Open `js/openapi.js` and replace `YOUR_KEY_HERE` on line 1 with your key [ in this test version I have hardcoded my own key]
3. Open `openapi.html` in a browser (or run with Live Server in VS Code)

## How to use

1. Click **Load Teams** to fetch all 32 Qatar 2022 nations
2. Select a team from the dropdown
3. Click **Load Results** to see that team's full tournament results

## Files

- `openapi.html` — page structure
- `css/openapi.css` — styling
- `js/openapi.js` — API calls and DOM manipulation
