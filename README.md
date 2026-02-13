# Lumin Journal

A minimalist, collaborative digital journal built with Next.js, Fabric.js, and Firebase.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure Firebase:**
    Create a `.env.local` file in the root directory with your Firebase configuration:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    ```
    Alternatively, edit `src/lib/firebase.ts` directly.

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000).

## Features

- **Book Interface:** Realistic page flip animation using `react-pageflip`.
- **Canvas Editor:** Draw, add text, and upload images using `fabric.js` (v5).
- **Real-time Collaboration:** Syncs canvas state across users via Firebase Firestore.
- **Tools:** Brush, Text, Image Upload, Clear, Download Page.
- **Music:** Lo-fi background music player.

## Usage Tips

- Click "Brush" to draw.
- Click "Text" then click on the page to add a text box.
- Click "Image" to upload an image from your device.
- Changes are saved automatically if Firebase is configured.

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Fabric.js
- React PageFlip
- Firebase
- Lucide React (Icons)

## Music Playlist Feature
Work in progress.
