# Brains-Tech AI Chatbot

A modern AI chatbot powered by Google's Gemini API with a beautiful, responsive interface. Features include text messaging, image uploads, emoji picker, and secure API key handling through Vercel serverless functions.

## Features

- 💬 Real-time chat with Google Gemini AI
- 🖼️ Image upload and analysis
- 😊 Emoji picker integration
- 📱 Responsive design for mobile and desktop
- 🔒 Secure API key handling (never exposed to frontend)
- ⚡ Fast serverless deployment on Vercel

## Project Structure

```
ChatBot/
├── api/
│   └── chat.js          # Vercel serverless function for API calls
├── index.html           # Main HTML file
├── style.css           # Styling and responsive design
├── script.js           # Frontend JavaScript logic
├── favicon.png         # Chatbot icon
├── vercel.json         # Vercel configuration
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Local Development

1. Clone or download this project
2. Copy `.env.example` to `.env.local` and add your Google Gemini API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```
3. Install Vercel CLI: `npm i -g vercel`
4. Run locally: `vercel dev`
5. Open `http://localhost:3000`

## Deployment to Vercel

### Option 1: Vercel CLI
1. Install Vercel CLI: `npm install -g vercel`
2. In your project directory, run: `vercel`
3. Follow the prompts to deploy
4. Add your environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GOOGLE_API_KEY` with your actual API key

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository or upload your project
4. Add environment variable `GOOGLE_API_KEY` in project settings
5. Deploy

## Getting Your Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your environment variables

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | Yes |

## API Endpoints

- `POST /api/chat` - Send messages to the AI chatbot

## Security Features

- ✅ API key stored securely in environment variables
- ✅ API key never exposed to frontend code
- ✅ Server-side API calls only
- ✅ Input validation and error handling

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
