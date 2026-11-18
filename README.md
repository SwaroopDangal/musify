# Musify

Musify is a full-stack web application with a separate frontend and backend, deployed on Render.

**Live site:** [musify-1ja3.onrender.com](https://musify-1ja3.onrender.com/)

## Project Structure

```
musify/
├── backend/        # Server-side code
├── frontend/       # Client-side code
└── package.json    # Root scripts and dependencies
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SwaroopDangal/musify.git
   cd musify
   ```

2. Install dependencies for the root, backend and frontend:

   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. Add a `.env` file inside `backend/` with the configuration values the server needs (such as the port and database connection string).

### Running Locally

Start the backend:

```bash
cd backend
npm start
```

In a second terminal, start the frontend:

```bash
cd frontend
npm run dev
```

Then open the local address shown in the terminal.

## Deployment

The app is hosted on [Render](https://render.com/) at [musify-1ja3.onrender.com](https://musify-1ja3.onrender.com/). On Render's free tier, the first request after a period of inactivity can take a little while to respond.

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Author

**Swaroop Dangal** — [@SwaroopDangal](https://github.com/SwaroopDangal)
