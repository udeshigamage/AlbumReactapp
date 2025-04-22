Overview
Album Gallery is a photo management web app where users can create albums, upload and view photos in a grid or slideshow. Users can also search for images from public APIs and insert them into albums. The app is built with React (TypeScript) and styled using Material UI, with modern tools for state management and data handling.

This repository contains the React (TypeScript) frontend, built with Material UI, Redux, and TanStack Query.

Tech Stack
React (TypeScript) – UI Development

Material UI (MUI) – Styling & Components

React Router – Navigation

Redux + Redux Persist – State Management & Persistence

TanStack Query (React Query) – Data Fetching & Caching

Axios – API Requests

React Hook Form + Yup – Form Handling & Validation

LocalStorage – Persist photo references or temporary form states

JSON Server – Mock API for albums and photos

Features
📁 Albums
Create, edit & delete albums

View albums in folder view or table view

Split screen: album list on one side, selected album’s photos on the other

Redux Persist stores album state across reloads

🖼️ Photos
Upload photos (file name only stored in JSON Server)

View photos in grid layout or slideshow

View photo metadata: title, description, album

Add photos using validated form

🔍 Search Integration
Search and insert copyright-free images (e.g., Unsplash API)

Add external images into existing albums

✅ Form Validation
Form input validated using Yup & React Hook Form

Responsive UI & error handling

🧠 State Management
Redux used for global state (selected album, UI state, etc.)

Redux Persist keeps albums and photos intact after reload

TanStack Query handles data fetching & caching
