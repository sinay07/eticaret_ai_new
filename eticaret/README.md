# E-Ticaret Projesi

Bu proje, React tabanlı bir e-ticaret web uygulaması ve Node.js backend API'si içerir.

## 🚀 Özellikler

- **Frontend**: React.js ile geliştirilmiş modern kullanıcı arayüzü
- **Backend**: Node.js ve Express.js API
- **Admin Panel**: Yönetici paneli
- **Veritabanı**: MySQL
- **Ödeme**: Stripe entegrasyonu
- **AI Chat**: OpenAI entegrasyonu
- **Real-time**: Socket.IO ile gerçek zamanlı iletişim

## 📁 Proje Yapısı

```
eticaret/
├── src/                    # React frontend
├── public/                 # Static dosyalar
├── node-backend/          # Ana backend API
├── admin/                 # Admin paneli
│   ├── src/              # React admin frontend
│   └── node-backend/     # Admin backend API
└── eticaret.sql          # Veritabanı şeması
```

## 🛠️ Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MySQL
- npm veya yarn

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd eticaret
```

### 2. Environment Variables Ayarlayın

#### Ana Backend için:
```bash
cd node-backend
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eticaret

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Server Configuration
PORT=5001
NODE_ENV=development
```

#### Admin Backend için:
```bash
cd admin/node-backend
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=eticaret

# Server Configuration
PORT=5002
NODE_ENV=development
```

### 3. Veritabanını Kurun

```bash
mysql -u root -p < eticaret.sql
```

### 4. Dependencies Yükleyin

#### Ana proje:
```bash
npm install
```

#### Backend:
```bash
cd node-backend
npm install
```

#### Admin:
```bash
cd admin
npm install
cd node-backend
npm install
```

### 5. Uygulamayı Başlatın

#### Backend API'leri:
```bash
# Ana backend (port 5001)
cd node-backend
npm start

# Admin backend (port 5002)
cd admin/node-backend
npm start
```

#### Frontend:
```bash
# Ana frontend (port 3000)
npm start

# Admin frontend (port 3001)
cd admin
npm start
```

## 🔧 API Endpoints

### Ana Backend (Port 5001)
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/register` - Kullanıcı kaydı
- `GET /api/products` - Ürün listesi
- `POST /api/orders` - Sipariş oluşturma
- `POST /api/detect-intent` - AI chat

### Admin Backend (Port 5002)
- `POST /api/login` - Admin girişi
- `GET /api/main-categories` - Ana kategoriler
- `POST /api/add-product` - Ürün ekleme
- `PUT /api/update-product` - Ürün güncelleme

## 🔐 Güvenlik

- Tüm API key'ler environment variables olarak saklanır
- JWT token authentication
- CORS yapılandırması
- SQL injection koruması

## 📝 Notlar

- `.env` dosyaları asla GitHub'a yüklenmemelidir
- Google Cloud Service Account dosyaları `.gitignore` ile korunur
- Upload edilen dosyalar `public/assets/images/upload/` klasöründe saklanır

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
