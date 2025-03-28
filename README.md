# Maya Inventory Manager

A simple, single-user web application for tracking products, costs, sales, and daily profit.

## Features

- Add and manage product details (serial number, name, cost price, shipping cost, sales fee, selling price)
- Track daily sales by selecting products, quantity, and date
- Calculate and display profit for each product and each day
- Simple, clean interface with responsive design
- Fast performance, even with hundreds of products
- Data stored securely in Supabase (PostgreSQL)

## Tech Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Docker container for running on Proxmox

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (free tier works fine)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/maya-inventory-manager.git
cd maya-inventory-manager
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:

   a. Create a free Supabase account at [https://supabase.com](https://supabase.com)
   
   b. Create a new project in Supabase
   
   c. Go to the SQL Editor in your Supabase dashboard
   
   d. Create the required database tables by running the SQL in the `setup-database.sql` file
   
   e. Go to Project Settings > API and copy the URL and anon/public key

4. Configure environment variables:

   a. Rename `.env.local.example` to `.env.local` (or create a new `.env.local` file)
   
   b. Add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Building for Production

To build the application for production:

```bash
npm run build
npm start
```

## Docker Deployment

### Option 1: Using the Dockerfile

1. Build the Docker image:

```bash
docker build -t maya-inventory-manager .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your-supabase-url -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key maya-inventory-manager
```

### Option 2: Using Docker Compose

1. Make sure your Supabase credentials are in your environment or create a `.env` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

2. Run with Docker Compose:

```bash
docker-compose up -d
```

## Deploying to Proxmox

1. Transfer your project to your Proxmox server (using SCP, Git, or any other method)

2. Install Docker and Docker Compose on your Proxmox server if not already installed

3. Navigate to your project directory and build/run using Docker Compose:

```bash
cd maya-inventory-manager
docker-compose up -d
```

4. The application will be accessible at `http://your-proxmox-server-ip:3000`

## License

This project is licensed under the MIT License. 