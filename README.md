# Imposter Game

A fun party game where players try to find the imposter among them. Based on the popular TikTok game "Undercover" or "Spyfall".

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd game
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## 🎮 How to Play

1. **Setup**
   - Choose a category
   - Select the number of players (3-12)
   - Choose how many imposters there will be (1-3, must be less than number of players)

2. **Gameplay**
   - Pass the device to the first player
   - The player taps "Reveal" to see their role
   - Normal players see the secret word
   - Imposters see "IMPOSTER"
   - After viewing, tap "Next Player" and pass the device
   - Continue until all players have seen their roles

3. **Discussion**
   - Players discuss to find the imposter
   - The imposter tries to blend in and guess the word
   - Vote to reveal the imposter or let the imposter guess the word

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Geist Font](https://vercel.com/font)

## 📂 Project Structure

```
/app
  /game         # Game page
  page.tsx      # Home page with game setup
  layout.tsx    # Root layout

/components     # Reusable components
  Button.tsx
  CategorySelect.tsx
  PlayerCountSelect.tsx
  ImposterCountSelect.tsx
  RevealCard.tsx
  SelectField.tsx
  GameProvider.tsx

/data           # Game data
  data.json     # Categories and words

/lib            # Utility functions
  gameLogic.ts  # Game state management
  shuffle.ts    # Array shuffling utilities

/types          # TypeScript types
  game.ts       # Game-related type definitions
```

## 📝 Adding Custom Categories

You can add or modify categories by editing the `data/data.json` file. Each category should have a name and an array of words.

```json
{
  "categories": [
    {
      "name": "Category Name",
      "words": ["Word 1", "Word 2", "Word 3"]
    }
  ]
}
```

## 🚀 Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Other Platforms

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details on deploying to other platforms.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
