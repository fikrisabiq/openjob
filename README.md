# OpenJob — Job Portal Backend API (REST & GraphQL)

**OpenJob** adalah layanan backend API untuk platform portal lowongan kerja (*job portal*) yang mendukung arsitektur **RESTful API** sekaligus **GraphQL**. Proyek ini dirancang dengan pemisahan lapisan yang bersih (*clean modular architecture*), dilengkapi manajemen autentikasi berbasis JWT, *caching* menggunakan Redis, *message broker* menggunakan RabbitMQ, serta sistem migrasi database relasional PostgreSQL.

---

## Fitur Utama

- **Dual API Paradigm (REST & GraphQL)**: Menyediakan *endpoint* RESTful modular dan *endpoint* tunggal `/graphql` untuk kueri data relasional bersarang (*nested queries*) yang efisien tanpa *over-fetching*.
- **Manajemen Pengguna & Autentikasi (`/users`, `/authentications`)**: Registrasi, login, pengelolaan *access token* dan *refresh token*, serta otorisasi berbasis hak akses (*role-based*).
- **Profil Kandidat (`/profile`)**: Pengelolaan data profil pencari kerja, riwayat lamaran, dan lowongan tersimpan.
- **Manajemen Perusahaan & Kategori (`/companies`, `/categories`)**: Pengelolaan data profil perusahaan penyedia kerja dan pengelompokan kategori pekerjaan.
- **Lowongan Kerja (`/jobs`)**: Pembuatan, pembaruan, pencarian berbasis filter, kontrol visibilitas gaji, dan pengelolaan daftar lowongan pekerjaan.
- **Lamaran Kerja (`/applications`)**: Pengajuan lamaran oleh kandidat (dengan validasi anti-duplikasi) dan pelacakan status lamaran.
- **Bookmark Lowongan (`/bookmarks`)**: Fitur penyimpanan dan penghapusan lowongan pekerjaan favorit per pengguna.
- **Unggah Dokumen (`/documents`)**: Manajemen unggahan berkas lamaran kandidat (CV/PDF).
- **Caching & Asynchronous Messaging**: Pemanfaatan **Redis** untuk mempercepat respons kueri (digunakan bersama oleh REST dan GraphQL) serta **RabbitMQ** (*producer service*) untuk pemrosesan tugas asinkron.

---

## Teknologi yang Digunakan

- **Runtime & Framework**: Node.js, Express.js
- **API & Query Language**: RESTful API, GraphQL (`graphql`, `graphql-yoga`)
- **Database & Migration**: PostgreSQL (`pg` raw SQL queries), `node-pg-migrate`
- **Caching**: Redis
- **Message Broker**: RabbitMQ (`amqplib`)
- **Authentication & Security**: JSON Web Token (JWT), Bcrypt
- **Validation & Code Quality**: Joi / Schema Validation, ESLint

---

## Struktur Proyek

```text
openjob/
├── migrations/                  # Skema migrasi tabel database (users, jobs, applications, dll.)
├── src/
│   ├── exceptions/              # Custom error handling (ClientError, InvariantError, AuthError, NotFoundError)
│   ├── graphql/                 # Lapisan API GraphQL (menggunakan ulang repository layer)
│   │   ├── index.js             # Konfigurasi GraphQL Yoga & konteks autentikasi JWT
│   │   ├── resolvers.js         # Query, Mutation, dan Field Resolvers relasional
│   │   └── type-defs.js         # Definisi skema GraphQL (Type, Query, Mutation)
│   ├── infrastructure/
│   │   ├── cache/               # Konfigurasi & layanan Redis (redis-service.js)
│   │   └── rabbitmq/            # Producer service untuk RabbitMQ (producerService.js)
│   ├── middlewares/             # Middleware autentikasi, validasi skema, dan global error handler
│   ├── modules/                 # Modul fitur berbasis domain bisnis (Controller, Repository, Routes, Schema)
│   │   ├── applications/
│   │   ├── authentications/
│   │   ├── bookmarks/
│   │   ├── categories/
│   │   ├── companies/
│   │   ├── documents/
│   │   ├── jobs/
│   │   ├── profile/
│   │   └── users/
│   ├── routes/                  # Registrasi rute utama REST API
│   ├── security/                # Token manager (JWT)
│   ├── server/                  # Konfigurasi server Express & registrasi middleware GraphQL
│   ├── utils/                   # Utilitas standar format respons API
│   └── server.js                # Entry point aplikasi
├── eslint.config.js
└── package.json
```

---

## Instalasi & Menjalankan Proyek

### 1. Prasyarat
Pastikan perangkat Anda sudah terinstal:
- Node.js (v18 atau terbaru)
- PostgreSQL
- Redis Server
- RabbitMQ Server

### 2. Clone Repositori & Instal Dependensi
```bash
git clone [https://github.com/fikrisabiq/openjob.git](https://github.com/fikrisabiq/openjob.git)
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

## Daftar Endpoint REST API

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
| **Bookmarks** | `POST` / `GET` / `DELETE` | `/bookmarks` | Menyimpan, melihat, & menghapus lowongan tersimpan |
| **Documents** | `POST` | `/documents` | Mengunggah dokumen pendukung lamaran (PDF) |

---

## GraphQL API (`/graphql`)

Server menyediakan antarmuka interaktif **GraphiQL** di `http://localhost:5000/graphql` untuk menguji kueri dan mutasi secara langsung. Untuk operasi yang memerlukan autentikasi, sertakan header `Authorization: Bearer <ACCESS_TOKEN>`.

### Contoh Query (Mengambil Lowongan Beserta Relasi Perusahaan & Kategori)
```graphql
query GetJobsWithRelations {
  jobs(title: "Backend") {
    id
    title
    job_type
    experience_level
    location_type
    location_city
    salary_min
    salary_max
    company {
      id
      name
      location
    }
    category {
      id
      name
    }
  }
}
```

### Contoh Query Terautentikasi (Profil, Riwayat Lamaran, & Bookmark)
```graphql
query GetMyProfile {
  myProfile {
    id
    name
    email
    applications {
      id
      status
      job {
        title
        company {
          name
        }
      }
    }
    bookmarks {
      id
      job {
        title
        location_city
      }
    }
  }
}
```

### Contoh Mutation (Melamar Lowongan & Menyimpan Bookmark)
```graphql
mutation ApplyAndBookmarkJob {
  applyJob(job_id: "job-id-123") {
    id
    status
  }
  addBookmark(job_id: "job-id-123") {
    id
    created_at
  }
}
```

---

## Kontributor

- **Fikri Fauzan Sabiq** — [LinkedIn](https://www.linkedin.com/in/fikrifauzansabiq) | [GitHub](https://github.com/fikrisabiq)
