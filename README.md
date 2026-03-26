# 🛒 E-Commerce Fullstack App

Bu proje, React (frontend) ve .NET Core Web API (backend) kullanılarak geliştirilmiş bir e-ticaret sistemidir.

---

## 🚀 Kullanılan Teknolojiler

### Frontend
- React
- Axios
- Tailwind CSS

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- MSSQL

---

## 📂 Proje Yapısı


ecommerce-fullstack/
│
├── ECommerce.API/ # .NET API
└── frontend/ # React uygulaması


---

## ⚙️ Kurulum

### 1. ECommerce.API (Backend)


cd ECommerce.API,
dotnet restore,
dotnet ef database update,
dotnet run


---

### 2. Frontend


cd frontend,
npm install,
npm run dev


---

## 🔗 API Bağlantısı

Frontend, backend API ile Axios üzerinden haberleşir.

---

## 📌 Özellikler

- Ürün listeleme
- Ürün ekleme / silme / arşivleme
- Kategori yönetimi
- Kullanıcı yönetimi
- Sipariş sistemi

---

## ⚠️ Not

Siparişlerde kullanılan ürünler kalıcı olarak silinemez, arşivlenir.

---

## 👨‍💻 Geliştirici

Bu proje, fullstack geliştirme pratiği amacıyla yapılmıştır.
