# JehlickaWeb

A simple Node.js Express web application that provides basic HTTP endpoints.

## Features

- Simple greeting endpoint (`/`)
- Health check endpoint (`/health`)
- Runs on configurable port (default: 3000)

## Requirements

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JehlickaWeb
```

2. Install dependencies:
```bash
npm install
```

## Usage

Start the application:
```bash
npm start
```

The application will listen on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

### Available Endpoints

- **GET `/`** - Returns a greeting message
- **GET `/health`** - Returns health status in JSON format

## Environment Variables

- `PORT` - The port on which the application will run (default: 3000)

## License

MIT