# Lucky Logic

A modern customer management system built with Next.js 14, featuring a sleek dark theme and intuitive user interface.

## Features

- 🎨 Modern dark theme UI with glass design
- 📱 Fully responsive design
- 👥 Customer management system with UUID tracking
- 📊 Interactive dashboard
- 🔍 Advanced search & filtering
- 📝 Customer records management
- Add, edit, and delete customer records
- Australian state/territory selection with proper abbreviations
- Address management with validation
- Active/Inactive status tracking
- Rate limiting protection
- Responsive dark theme UI

### Customer Management
- View detailed customer profiles
- Edit customer information
- Delete customers with confirmation
- Track customer status (Active/Inactive)
- Australian address format with state/territory dropdown
- UUID (Universally Unique Identifier) tracking
- Searchable customer list with pagination
- Debounced search for better performance

### Security Features
- Confirmation required for destructive actions
- Rate limiting protection with visual feedback
- Error handling and validation
- Permission-based access control
- Proper UUID handling for database records

### User Interface
- Modern dark theme with glass morphism design
- Fully responsive layout
- Loading states and animations
- Toast notifications for user feedback
- Modal confirmations for important actions
- Intuitive navigation with breadcrumbs
- Paginated tables with dynamic page size
- Debounced search inputs

## Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Database:** Supabase
- **State Management:** React Hooks
- **UI Components:** 
  - Custom Glass Design
  - Headless UI
  - React Icons
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast

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
│   ├── AddCustomerForm   # Customer creation form
│   ├── EditCustomerForm  # Customer edit form
│   ├── DeleteConfirmationModal # Delete confirmation
│   └── Sidebar          # Navigation sidebar
├── lib/                  # Utility functions and configs
└── styles/              # Global styles
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
