# Product Status Checker

Aplikasi web untuk mengecek status produk di production secara real-time. Terhubung dengan API Eraspace untuk validasi data produk.

## Features

✅ **Form Input Dinamis** - Input SKU dan store code dengan mudah  
✅ **Real-time Data Fetch** - Ambil data dari API Eraspace secara instant  
✅ **Modern UI** - Design yang clean dan fresh dengan Tailwind CSS  
✅ **Status Indicators** - Lihat status produk dengan visual badges  
✅ **Preorder Info** - Informasi lengkap tentang preorder (jika aktif)  
✅ **ATC Management** - Cek kapan Add to Cart dinonaktifkan  
✅ **Error Handling** - Pesan error yang jelas dan informatif  
✅ **Loading State** - Indikator loading saat fetch data  

## Fields yang Ditampilkan

- `is_preorder` - Apakah produk preorder?
- `preorder_start` - Kapan preorder dimulai
- `preorder_end` - Kapan preorder berakhir
- `preorder_store` - Toko mana yang preorder
- `atc_disabled_start` - Kapan ATC disabled dimulai
- `atc_disabled_end` - Kapan ATC disabled berakhir
- `is_new_custom` - Apakah produk baru custom?

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool (super cepat!)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Instalasi Local

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview
```

Development server akan berjalan di `http://localhost:3000`

## Deploy ke Vercel

### Opsi 1: GitHub + Vercel Integration (Recommended)

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Product Status Checker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/product-checker.git
   git push -u origin main
   ```

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import repository yang baru di-push
   - Vercel akan auto-detect Vite config
   - Click Deploy

3. **Done!** App akan live di `https://your-project.vercel.app`

### Opsi 2: Vercel CLI (Untuk Quick Deploy)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Untuk production
vercel --prod
```

## Environment Variables

App ini tidak memerlukan env variables karena API public. Tapi kalau nanti butuh, buat `.env.local`:

```
VITE_API_BASE_URL=https://jeanne.eraspace.com/products/api/v4.1
```

## Struktur Project

```
product-checker/
├── src/
│   ├── App.jsx          # Main component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite config
├── tailwind.config.js   # Tailwind config
├── postcss.config.js    # PostCSS config
├── package.json         # Dependencies
└── README.md           # This file
```

## API Endpoint

```
GET https://jeanne.eraspace.com/products/api/v4.1/products/{SKU}?store_code={STORE_CODE}
```

**Parameters:**
- `SKU` (required) - Product SKU/ID. Contoh: `8100026281`
- `store_code` (required) - Store code. Contoh: `erafone`

**Response:** JSON object dengan detail produk

## Tips & Tricks

- **Testing**: Gunakan SKU `8100026281` dengan store code `erafone` untuk testing
- **View Raw Data**: Klik "📋 Lihat Data Lengkap" untuk melihat full API response
- **Error Messages**: Jika produk tidak ditemukan, akan muncul error message yang jelas

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+  

## License

MIT

## Support

Untuk bantuan atau report bug, silakan hubungi tim development.
