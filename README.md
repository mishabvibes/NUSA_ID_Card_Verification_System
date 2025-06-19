# Student Verification System

A professional web application for student identity verification. The system allows students to verify their identity by entering a token number, viewing their details, and confirming or reporting discrepancies. It also includes an admin dashboard for managing student data and monitoring verification statuses.

## Features

### Student Features
- Verify identity by entering token number
- View personal details and photo
- Confirm or report identity discrepancies
- Contact admin via WhatsApp for issues

### Admin Features
- Dashboard with verification statistics
- Student management (add, edit, delete)
- CSV upload for batch student data import
- Photo management via Supabase storage

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: MongoDB for student data
- **Storage**: Supabase for student photos
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Charts**: Chart.js
- **CSV Parsing**: papaparse

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Supabase account with storage bucket named "students"

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/student-verification-system.git
   cd student-verification-system
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Usage

### Student Verification
1. Navigate to the verification page
2. Enter your token number
3. Verify your identity by confirming or reporting discrepancies

### Admin Access
1. Login at `/admin/login` with the demo credentials:
   - Email: admin@example.com
   - Password: admin123
2. Use the dashboard to monitor verification status
3. Manage students via the Students page
4. Upload CSV data via the CSV Upload page

## CSV Format

The CSV file for uploading student data should have the following format:

\`\`\`
T.No,Name
676,MOHAMED RIYAS TK
677,MUHAMMED RASHID KP
\`\`\`

- **T.No**: Unique token number (integer)
- **Name**: Student's full name

## Photo Storage

Photos should be named according to the token number (e.g., `676.jpg`) and uploaded to the Supabase "students" bucket.

## License

This project is licensed under the MIT License.
\`\`\`

Let's also create a tailwind.config.js file:
