# 🏥 KrysLink - Pharmaceutical Marketplace Platform

![KrysLink Banner](https://img.shields.io/badge/KrysLink-Healthcare_Platform-0d9488?style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=for-the-badge&logo=inertia&logoColor=white)

> A comprehensive B2B pharmaceutical marketplace connecting Kenyan healthcare providers (pharmacies & hospitals) with verified suppliers. Built with Laravel, React, TypeScript, and Inertia.js.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Requirements](#-system-requirements)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [User Roles](#-user-roles)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🛒 **Customer Portal (Pharmacies & Hospitals)**
- Browse PPB-verified pharmaceutical products
- Advanced search and filtering by category
- Real-time stock availability
- Shopping cart with VAT calculation (16%)
- Secure checkout process
- Order tracking and history
- AI-powered chatbot assistance (Daktari AI)
- Profile management with license verification

### 📦 **Supplier Dashboard**
- Comprehensive inventory management
- Product CRUD operations with image uploads
- Stock level monitoring and alerts
- Bulk product actions
- Order fulfillment system
- Sales analytics and reporting
- Document management (CoA, Import Licenses)

### 👨‍💼 **Admin Panel**
- User verification and approval system
- Supplier license validation (PPB & KRA)
- Product verification workflow
- Category management
- Platform analytics
- User role management
- Content moderation

### 🔐 **Authentication & Security**
- Multi-role authentication (Admin, Supplier, Pharmacy, Hospital)
- KRA PIN verification for businesses
- PPB license validation
- Email verification
- Password reset functionality
- Session management
- CSRF protection

### 💼 **Business Features**
- Wholesale pricing
- Bulk order discounts
- Invoice generation with ETIMS compliance
- Multi-county delivery support
- Cold chain logistics tracking
- Prescription requirement flags
- Payment integration ready

---

## 🛠 Tech Stack

### **Backend**
- **Framework:** Laravel 10.x
- **Language:** PHP 8.1+
- **Database:** MySQL 8.0+
- **ORM:** Eloquent
- **API:** RESTful + Inertia.js

### **Frontend**
- **Library:** React 18.x
- **Language:** TypeScript 5.x
- **Framework:** Inertia.js 1.x
- **Styling:** Tailwind CSS 3.x
- **Icons:** Lucide React
- **State Management:** React Hooks
- **Build Tool:** Vite

### **Additional Tools**
- **File Storage:** Laravel Storage (S3 ready)
- **Image Processing:** Intervention Image
- **PDF Generation:** DomPDF
- **Email:** Laravel Mail
- **Queue:** Laravel Queue
- **Cache:** Redis (optional)

---

## 💻 System Requirements

- **PHP:** >= 8.1
- **Node.js:** >= 18.x
- **NPM/Yarn:** >= 9.x
- **MySQL:** >= 8.0 or MariaDB >= 10.3
- **Composer:** >= 2.x
- **Git:** Latest version

### **Recommended Server Specs (Production)**
- **CPU:** 2+ cores
- **RAM:** 4GB minimum, 8GB recommended
- **Storage:** 20GB+ SSD
- **OS:** Ubuntu 22.04 LTS or similar

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/kryslink.git
cd kryslink
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Configure Environment Variables

Edit `.env` file:

```env
APP_NAME="KrysLink"
APP_ENV=local
APP_KEY=base64:YOUR_GENERATED_KEY
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kryslink
DB_USERNAME=root
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@kryslink.co.ke
MAIL_FROM_NAME="${APP_NAME}"

# Optional: Gemini AI for chatbot
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🗄️ Database Setup

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE kryslink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Run Migrations

```bash
# Fresh migration (drops all tables)
php artisan migrate:fresh

# Or regular migration
php artisan migrate
```

### 3. Seed Database

```bash
# Seed all data (categories, users, products)
php artisan db:seed

# Or seed specific seeders
php artisan db:seed --class=CategorySeeder
php artisan db:seed --class=AdminUserSeeder
php artisan db:seed --class=SupplierSeeder
php artisan db:seed --class=ProductSeeder
```

### 4. Link Storage

```bash
php artisan storage:link
```

---

## ⚙️ Configuration

### File Upload Limits

Edit `php.ini`:

```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
```

### Queue Configuration

For production, use Redis or Database queue:

```env
QUEUE_CONNECTION=database
```

Then run queue worker:

```bash
php artisan queue:work
```

### Email Testing

Use [Mailtrap](https://mailtrap.io) for development email testing.

### Cache Configuration

```bash
# Clear all caches
php artisan optimize:clear

# Cache routes and config (production)
php artisan optimize
```

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```
Server runs at: `http://localhost:8000`

**Terminal 2 - Vite Frontend:**
```bash
npm run dev
# or
yarn dev
```

**Terminal 3 - Queue Worker (Optional):**
```bash
php artisan queue:work
```

### Production Build

```bash
# Build frontend assets
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 👥 User Roles

### Default Seeded Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@kryslink.co.ke | password | Full system access |
| **Supplier** | supplier1@example.com | password | Product & order management |
| **Pharmacy** | pharmacy1@example.com | password | Browse & purchase |
| **Hospital** | hospital1@example.com | password | Browse & purchase |

### Role Permissions

#### Admin
- ✅ Approve/reject user registrations
- ✅ Verify supplier licenses (PPB & KRA)
- ✅ Manage categories
- ✅ Product verification
- ✅ Platform analytics
- ✅ User management

#### Supplier
- ✅ Product CRUD operations
- ✅ Inventory management
- ✅ Order fulfillment
- ✅ Sales reporting
- ✅ Upload product images/documents
- ❌ Cannot access other suppliers' data

#### Customer (Pharmacy/Hospital)
- ✅ Browse verified products
- ✅ Add to cart & checkout
- ✅ Track orders
- ✅ Review products
- ✅ Manage profile
- ❌ Cannot access supplier dashboard

---

## 📁 Project Structure

```
kryslink/
├── app/
│   ├── Console/              # Artisan commands
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/       # Admin controllers
│   │   │   ├── Customer/    # Customer controllers
│   │   │   └── Supplier/    # Supplier controllers
│   │   ├── Middleware/      # Custom middleware
│   │   └── Requests/        # Form requests
│   ├── Models/              # Eloquent models
│   └── Policies/            # Authorization policies
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Database seeders
├── public/                  # Public assets
├── resources/
│   ├── js/
│   │   ├── Components/      # React components
│   │   ├── Pages/           # Inertia pages
│   │   │   ├── Admin/       # Admin pages
│   │   │   ├── Customer/    # Customer pages
│   │   │   └── Supplier/    # Supplier pages
│   │   ├── Layouts/         # Layout components
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   └── views/               # Blade templates
├── routes/
│   ├── web.php              # Web routes
│   └── api.php              # API routes
├── storage/
│   └── app/public/          # File uploads
├── tests/                   # PHPUnit tests
├── .env.example             # Environment template
├── composer.json            # PHP dependencies
├── package.json             # Node dependencies
└── README.md                # This file
```

---

## 📡 API Documentation

### Authentication Endpoints

```http
POST /register          # Register new user
POST /login            # User login
POST /logout           # User logout
POST /password/email   # Send password reset email
POST /password/reset   # Reset password
```

### Product Endpoints

```http
GET    /api/products              # List products
GET    /api/products/{id}         # Get product details
POST   /api/products              # Create product (Supplier)
PATCH  /api/products/{id}         # Update product (Supplier)
DELETE /api/products/{id}         # Delete product (Supplier)
```

### Cart Endpoints

```http
GET    /api/cart                  # Get cart items
POST   /api/cart/add              # Add to cart
PATCH  /api/cart/{id}             # Update quantity
DELETE /api/cart/{id}             # Remove from cart
DELETE /api/cart                  # Clear cart
```

### Order Endpoints

```http
GET    /api/orders                # List orders
GET    /api/orders/{id}           # Order details
POST   /api/orders                # Create order
PATCH  /api/orders/{id}/cancel    # Cancel order
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter ProductTest

# With coverage
php artisan test --coverage
```

### Create Tests

```bash
# Feature test
php artisan make:test ProductTest

# Unit test
php artisan make:test ProductTest --unit
```

---

## 🚀 Deployment

### Server Requirements

- Ubuntu 22.04 LTS
- Nginx or Apache
- PHP 8.1+ with extensions
- MySQL 8.0+
- Node.js 18+
- SSL Certificate (Let's Encrypt)

### Deployment Steps

1. **Clone repository on server**
```bash
git clone https://github.com/yourusername/kryslink.git
cd kryslink
```

2. **Install dependencies**
```bash
composer install --optimize-autoloader --no-dev
npm install && npm run build
```

3. **Configure environment**
```bash
cp .env.example .env
php artisan key:generate
# Edit .env with production settings
```

4. **Run migrations**
```bash
php artisan migrate --force
php artisan db:seed --force
```

5. **Set permissions**
```bash
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

6. **Optimize application**
```bash
php artisan optimize
php artisan storage:link
```

7. **Configure web server** (Nginx example)
```nginx
server {
    listen 80;
    server_name kryslink.co.ke;
    root /var/www/kryslink/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

8. **Setup SSL**
```bash
sudo certbot --nginx -d kryslink.co.ke
```

9. **Setup queue worker**
```bash
# Create supervisor config
sudo nano /etc/supervisor/conf.d/kryslink-worker.conf
```

```ini
[program:kryslink-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/kryslink/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/kryslink/storage/logs/worker.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start kryslink-worker:*
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow PSR-12 for PHP
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

- **Email:** support@kryslink.co.ke
- **Phone:** +254 700 123 456
- **Website:** [kryslink.co.ke](https://kryslink.co.ke)
- **Documentation:** [docs.kryslink.co.ke](https://docs.kryslink.co.ke)

---

## 🙏 Acknowledgments

- Laravel community
- React community
- Tailwind CSS
- Inertia.js team
- Pharmacy Poisons Board (PPB) Kenya
- Kenya Revenue Authority (KRA)

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment integration (M-Pesa, Card)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (English, Swahili)
- [ ] Inventory forecasting with AI
- [ ] Integration with hospital management systems
- [ ] Automated invoicing with ETIMS
- [ ] SMS notifications
- [ ] Loyalty program
- [ ] Supplier rating system

---

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/yourusername/kryslink)
![GitHub contributors](https://img.shields.io/github/contributors/yourusername/kryslink)
![GitHub stars](https://img.shields.io/github/stars/yourusername/kryslink?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/kryslink?style=social)

---

**Built with ❤️ for Kenyan Healthcare Providers**
