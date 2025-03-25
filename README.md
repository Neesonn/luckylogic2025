# Lucky Logic

A modern customer management system built with Next.js 14, featuring a sleek dark theme and intuitive user interface.

## Features

- 🎨 Modern dark theme UI with glass design
- 📱 Fully responsive design
- 👥 Customer management system with UCID tracking
- 📊 Interactive dashboard
- 🔍 Advanced search & filtering
- 📝 Customer records management
- Add, edit, and delete customer records
- Australian state/territory selection with proper abbreviations
- Address management with validation
- Active/Inactive status tracking
- Bulk customer generation for testing
- Rate limiting protection
- Responsive dark theme UI

### Customer Management
- View detailed customer profiles
- Edit customer information
- Delete customers with confirmation
- Track customer status (Active/Inactive)
- Australian address format with state/territory dropdown
- UCID (Unique Customer ID) tracking

### Security Features
- Confirmation required for destructive actions
- Rate limiting protection
- Error handling and validation
- Permission-based access control

### User Interface
- Modern dark theme
- Responsive design
- Loading states and animations
- Toast notifications for feedback
- Modal confirmations for important actions
- Intuitive navigation

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **UI Components:** Custom Glass Design
- **Database:** Supabase

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Neesonn/luckylogic2025.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables (see `.env.example`)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- Additional variables as needed for authentication and other services

## Project Structure

```
src/
├── app/                    # App router pages
│   ├── admin-dashboard/    # Admin dashboard
│   ├── customers/         # Customer management
│   └── page.tsx          # Homepage
├── components/            # Reusable components
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Contact

For any inquiries, please reach out to the development team.
