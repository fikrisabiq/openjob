# OpenJob — Job Portal Backend API

**OpenJob** adalah layanan backend RESTful API untuk platform portal lowongan kerja (*job portal*). Proyek ini dirancang dengan arsitektur modular (*controller-repository-route-schema*), dilengkapi dengan manajemen autentikasi berbasis token, *caching* menggunakan Redis, *message broker* menggunakan RabbitMQ, serta sistem migrasi database relasional.

---

## Fitur Utama

* **Manajemen Pengguna & Autentikasi (`/users`, `/authentications`)**: Registrasi, login, pengelolaan *access token* dan *refresh token*, serta otorisasi berbasis hak akses.
* **Profil Kandidat (`/profile`)**: Pengelolaan data profil pencari kerja.
* **Manajemen Perusahaan & Kategori (`/companies`, `/categories`)**: Pengelolaan data profil perusahaan penyedia kerja dan pengelompokan kategori pekerjaan.
* **Lowongan Kerja (`/jobs`)**: Pembuatan, pembaruan, pencarian, dan pengelolaan daftar lowongan pekerjaan.
* **Lamaran Kerja (`/applications`)**: Pengajuan lamaran oleh kandidat dan pelacakan status lamaran.
* **Bookmark Lowongan (`/bookmarks`)**: Fitur penyimpanan lowongan pekerjaan favorit oleh pengguna.
* **Unggah Dokumen (`/documents`)**: Manajemen unggahan berkas lamaran kandidat (CV/PDF).
* **Caching & Asynchronous Messaging**: Pemanfaatan **Redis** untuk mempercepat respons data dan **RabbitMQ** (*producer service*) untuk pemrosesan tugas asinkron.

---

## Teknologi yang Digunakan

* **Runtime & Framework**: Node.js, Express.js
* **Database & Migration**: PostgreSQL, `node-pg-migrate`
* **Caching**: Redis
* **Message Broker**: RabbitMQ (`amqplib`)
* **Authentication & Security**: JSON Web Token (JWT), Bcrypt
* **Validation & Code Quality**: Joi / Schema Validation, ESLint

---

## Struktur Proyek

```text
openjob/
├── migrations/                  # Skema migrasi tabel database (users, jobs, applications, dll.)
├── src/
│   ├── exceptions/              # Custom error handling (ClientError, InvariantError, AuthError, NotFoundError)
│   ├── infrastructure/
│   │   ├── cache/               # Konfigurasi & layanan Redis (redis-service.js)
│   │   └── rabbitmq/            # Producer service untuk RabbitMQ (producerService.js)
│   ├── middlewares/             # Middleware autentikasi, validasi skema, dan global error handler
│   ├── modules/                 # Modul fitur berbasis domain bisnis
│   │   ├── applications/
│   │   ├── authentications/
│   │   ├── bookmarks/
│   │   ├── categories/
│   │   ├── companies/
│   │   ├── documents/
│   │   ├── jobs/
│   │   ├── profile/
│   │   └── users/
│   ├── routes/                  # Registrasi rute utama API
│   ├── security/                # Token manager (JWT)
│   ├── server/                  # Konfigurasi server Express
│   ├── utils/                   # Utilitas standar format respons API
│   └── server.js                # Entry point aplikasi
├── eslint.config.js
└── package.json
```

---

## Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan perangkat Anda sudah terinstal:
* Node.js (v18 atau terbaru)
* PostgreSQL
* Redis Server
* RabbitMQ Server

### 2. Clone Repositori & Instal Dependensi
```bash
git clone https://github.com/fikrisabiq/openjob.git
cd openjob
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` pada direktori utama proyek dan sesuaikan konfigurasi berikut:
```env
# Server Configuration
HOST=localhost
PORT=5000

# PostgreSQL Database
PGUSER=postgres
PGHOST=localhost
PGPASSWORD=your_password
PGDATABASE=openjob_db
PGPORT=5432

# JWT Secret Keys
ACCESS_TOKEN_KEY=your_access_token_secret
REFRESH_TOKEN_KEY=your_refresh_token_secret
ACCESS_TOKEN_AGE=1800

# Redis & RabbitMQ
REDIS_SERVER=localhost
RABBITMQ_SERVER=amqp://localhost
```

### 4. Jalankan Migrasi Database
```bash
npm run migrate up
```

### 5. Jalankan Server
```bash
# Mode development
npm run dev

# Mode production
npm start
```

---

## Daftar Endpoint Utama

| Modul | Method | Endpoint | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Users** | `POST` | `/users` | Registrasi pengguna baru |
| **Auth** | `POST` | `/authentications` | Login dan mendapatkan token |
| **Auth** | `PUT` | `/authentications` | Memperbarui *access token* |
| **Profile** | `GET` / `PUT` | `/profile` | Melihat dan mengubah profil pengguna |
| **Companies** | `GET` / `POST` | `/companies` | Melihat daftar & menambah data perusahaan |
| **Categories** | `GET` / `POST` | `/categories` | Mengelola kategori pekerjaan |
| **Jobs** | `GET` / `POST` | `/jobs` | Melihat daftar & membuat lowongan kerja |
| **Applications** | `POST` / `GET` | `/applications` | Melamar pekerjaan & melihat status lamaran |
| **Bookmarks** | `POST` / `GET` | `/bookmarks` | Menyimpan & melihat lowongan tersimpan |
| **Documents** | `POST` | `/documents` | Mengunggah dokumen pendukung lamaran (PDF) |

---

## Kontributor

* **Fikri Fauzan Sabiq** — [LinkedIn](https://www.linkedin.com/in/fikrifauzansabiq) | [GitHub](https://github.com/fikrisabiq)