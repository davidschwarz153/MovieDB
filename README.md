# MovieDB - React Movie Application

A modern, responsive movie database application built with React, TypeScript, and Tailwind CSS. This application allows users to browse trending movies, search for specific titles, manage favorites, and download movie posters.

## 🌟 Features

- **User Authentication**
  - Sign up and login functionality
  - Admin dashboard access
  - Secure user session management

- **Movie Management**
  - Browse trending movies
  - Search movies by title
  - View detailed movie information
  - Watch movie trailers
  - Download movie posters

- **User Experience**
  - Dynamic background images
  - Responsive design
  - Loading states and error handling
  - Success/error notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd MovieDB
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your TMDB API key:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Built With

- React
- TypeScript
- Tailwind CSS
- Vite
- TMDB API
- Lucide React (for icons)

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   ├── movie/
│   ├── movieDetail/
│   └── nav/
├── context/
│   ├── UserContext.tsx
│   ├── MainProvider.tsx
│   └── BackgroundContext.tsx
├── types/
└── App.tsx
```

## 👥 User Roles

- **Regular Users**
  - Browse movies
  - Add/remove favorites
  - Download posters
  - Watch trailers

- **Admin**
  - All regular user features
  - Access to admin dashboard
  - User management

## 🔐 Default Admin Credentials

```
Email: admin@moviedb.com
Password: admin123
```

## 🎨 Features

### Authentication
- Secure login/signup system
- Form validation
- Error handling
- Success notifications

### Movie Features
- Dynamic movie backgrounds
- Trailer viewing
- Poster downloads
- Favorite management

### UI/UX
- Responsive design
- Loading states
- Error notifications
- Clean, modern interface

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TMDB API for movie data
- Tailwind CSS for styling
- React community for inspiration

