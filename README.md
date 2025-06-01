# MedManage Pharmacy Management System 💊

A full-stack pharmacy management system with inventory control, sales tracking, and automated PDF billing.

## Features ✨

- **Secure Admin Authentication**
  - Role-based access control
  - Session persistence
- **Inventory Management**
  - Medicine stock tracking
  - Low stock alerts
- **Sales Processing**
  - Order management
  - Customer billing
- **PDF Invoice Generation** 🆕
  - Automatic bill creation
  - Professional templates
  - Download/Save options
- **Dashboard Analytics**
  - Sales reports
  - Revenue tracking

## Technologies Used 🛠️

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS (with custom animations)
- Font Awesome icons

### Backend
- Node.js with Express
- MongoDB (MongoDB Compass)
- PDFKit (for PDF generation)

### Development Tools
- Git & GitHub
- Postman (API testing)

## Project Structure 📁
med-manage/
├── public/ # Frontend assets
│ ├── css/ # Custom styles
│ ├── js/ # Client-side scripts
│ ├── bills/ # Generated PDF invoices
│ ├── index.html # Admin dashboard
│ └── login.html # Login page
├── backend/
│ ├── config/ # DB configuration
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── routes/ # API endpoints
│ ├── utils/ # PDF generator
│ ├── server.js # Main server file
│ └── package.json
├── data/ # Sample data
│ ├── 1MM.json # Medicine data
│ └── 1PO.json # Order data
└── README.md # Documentation


## Installation Guide 🚀

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/med-manage.git
   cd med-manage
