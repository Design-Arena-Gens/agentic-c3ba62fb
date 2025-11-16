# 🌟 Barter Qween

A modern barter/trading web application built with Next.js 14, React, Firebase, and Tailwind CSS.

## ✨ Features

### Authentication
- ✅ Email/Password registration and login
- ✅ Google Sign-In integration
- ✅ Password reset via email
- ✅ Persistent authentication state

### Profile Management
- ✅ View and edit user profile
- ✅ Avatar upload with Firebase Storage
- ✅ User statistics display
- ✅ Update personal information

### Item Management
- ✅ Create items with multiple images (up to 5)
- ✅ Full CRUD operations
- ✅ Real-time search (title, description, category)
- ✅ Category filtering (7 categories)
- ✅ Grid and list view toggle
- ✅ Share items functionality
- ✅ Beautiful image carousel
- ✅ Edit and delete your items

### Trade System
- ✅ Send trade offers with messages
- ✅ Received and sent trade management
- ✅ Accept/reject trade offers
- ✅ Trade status tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with Firestore, Authentication, and Storage enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd barter-qween
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration

4. Set up environment variables:
   - Update `.env.local` with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns

## 🗂️ Project Structure

```
barter-qween/
├── app/
│   ├── items/
│   │   ├── create/
│   │   └── [id]/
│   ├── login/
│   ├── signup/
│   ├── profile/
│   ├── my-items/
│   ├── trades/
│   └── reset-password/
├── components/
│   ├── Navbar.tsx
│   └── ItemCard.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   └── firebase.ts
├── types/
│   └── index.ts
└── public/
```

## 🔥 Firebase Setup

### Firestore Collections

1. **users**
   - id (string)
   - email (string)
   - displayName (string)
   - photoURL (string, optional)
   - bio (string, optional)
   - location (string, optional)
   - createdAt (timestamp)
   - itemsCount (number)
   - tradesCount (number)

2. **items**
   - id (auto-generated)
   - userId (string)
   - userName (string)
   - userPhoto (string, optional)
   - title (string)
   - description (string)
   - category (string)
   - condition (string)
   - images (array of strings)
   - createdAt (timestamp)
   - updatedAt (timestamp)

3. **trades**
   - id (auto-generated)
   - fromUserId (string)
   - toUserId (string)
   - fromUserName (string)
   - toUserName (string)
   - toItemId (string)
   - toItemTitle (string)
   - toItemImage (string, optional)
   - message (string)
   - status (string: pending/accepted/rejected/completed)
   - createdAt (timestamp)
   - updatedAt (timestamp)

### Security Rules

Set up Firestore security rules to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /items/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    match /trades/{tradeId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.fromUserId ||
         request.auth.uid == resource.data.toUserId);
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.toUserId;
    }
  }
}
```

## 🎨 Categories

- Electronics
- Clothing
- Books
- Home & Garden
- Sports
- Toys
- Other

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
