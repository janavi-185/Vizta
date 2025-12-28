# 📸 Vizta

A modern, high-performance social media platform built for seamless content sharing and social interaction.

## 🚀 Key Features

- **Authentication**: Secure signup and login powered by Appwrite.
- **Content Creation**: Effortlessly create, edit, and manage posts with image support.
- **Social Interaction**: Like and save your favorite posts.
- **Discovery**: Explore trending content with an infinite scroll interface.
- **Personalization**: Customizable user profiles and bio management.
- **Search**: Quickly find posts using the real-time search functionality.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Backend & Auth**: Appwrite
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form, Zod (Validation)
- **Routing**: React Router DOM

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- An Appwrite project

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd InstaClone
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Appwrite credentials:

   ```env
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_STORAGE_ID=your_storage_id
   VITE_APPWRITE_USER_COLLECTION_ID=your_user_collection_id
   VITE_APPWRITE_POST_COLLECTION_ID=your_post_collection_id
   VITE_APPWRITE_SAVES_COLLECTION_ID=your_saves_collection_id
   VITE_APPWRITE_URL=your_appwrite_endpoint
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📄 License

Distributed under the MIT License.
