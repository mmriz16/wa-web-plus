# 📤 Instruksi Upload ke GitHub

Karena Git tidak terinstall di sistem ini, berikut adalah instruksi manual untuk upload project ke GitHub:

## 🚀 Metode 1: Upload Manual via GitHub Web

### Step 1: Buat Repository Baru
1. Buka [GitHub.com](https://github.com) dan login
2. Klik tombol **"New"** atau **"+"** → **"New repository"**
3. Isi detail repository:
   - **Repository name**: `wawebplus-extension` atau `wa-web-plus`
   - **Description**: `Chrome Extension untuk meningkatkan WhatsApp Web dengan Hide Mode dan Restore Deleted Messages`
   - **Public** atau **Private** (pilih sesuai kebutuhan)
   - ✅ **Add a README file** (uncheck ini karena kita sudah punya)
   - ✅ **Add .gitignore** (pilih "Node" atau biarkan kosong)
   - **License**: MIT License (opsional)
4. Klik **"Create repository"**

### Step 2: Upload Files
1. Di halaman repository yang baru dibuat, klik **"uploading an existing file"**
2. **Drag & drop** atau **choose files** semua file dari folder:
   ```
   wawebplus-prototype/
   ├── manifest.json
   ├── background.js
   ├── content.js
   ├── README.md
   ├── .gitignore
   ├── UPLOAD_INSTRUCTIONS.md
   ├── popup/
   │   ├── popup.html
   │   └── popup.js
   ├── styles/
   │   └── hide.css
   └── icons/
       └── icon128.png
   ```

### Step 3: Commit Files
1. Scroll ke bawah ke bagian **"Commit changes"**
2. **Commit message**: `Initial commit - WA Web Plus Extension v1.0.0`
3. **Description** (opsional):
   ```
   - ✅ Hide Mode dengan blur effect
   - ✅ Restore Deleted Messages
   - ✅ Popup UI untuk toggle fitur
   - ✅ Auto-apply settings
   - ✅ Comprehensive error handling
   ```
4. Klik **"Commit changes"**

## 🛠️ Metode 2: Install Git dan Upload via Command Line

### Step 1: Install Git
1. Download Git dari [git-scm.com](https://git-scm.com/download/win)
2. Install dengan default settings
3. Restart Command Prompt/PowerShell

### Step 2: Setup Git (First Time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize dan Upload
```bash
# Masuk ke folder project
cd "D:\Miftakhul Rizky\App\extention-wa-plus\wawebplus-prototype"

# Initialize git repository
git init

# Add semua files
git add .

# Commit pertama
git commit -m "Initial commit - WA Web Plus Extension v1.0.0"

# Add remote repository (ganti dengan URL repository Anda)
git remote add origin https://github.com/USERNAME/REPOSITORY-NAME.git

# Push ke GitHub
git push -u origin main
```

## 📋 Checklist Upload

- [ ] Repository GitHub sudah dibuat
- [ ] Semua file sudah di-upload:
  - [ ] `manifest.json`
  - [ ] `background.js`
  - [ ] `content.js`
  - [ ] `README.md`
  - [ ] `.gitignore`
  - [ ] `popup/popup.html`
  - [ ] `popup/popup.js`
  - [ ] `styles/hide.css`
  - [ ] `icons/icon128.png`
- [ ] Commit message yang jelas
- [ ] Repository description yang informatif
- [ ] License dipilih (opsional)

## 🎯 Tips Upload

### File yang HARUS di-upload:
- ✅ Semua file `.js`, `.html`, `.css`, `.json`
- ✅ `README.md` (dokumentasi)
- ✅ `.gitignore` (untuk development)
- ✅ `icons/icon128.png`

### File yang TIDAK perlu di-upload:
- ❌ File temporary (`.tmp`, `.log`)
- ❌ IDE files (`.vscode/`, `.idea/`)
- ❌ OS files (`Thumbs.db`, `.DS_Store`)
- ❌ Node modules (jika ada)

## 🔗 Setelah Upload

1. **Verifikasi**: Pastikan semua file ter-upload dengan benar
2. **Test Clone**: Coba clone repository untuk memastikan bisa di-download
3. **Update README**: Tambahkan link GitHub di README jika perlu
4. **Share**: Bagikan link repository ke teman atau komunitas

## 📞 Bantuan

Jika mengalami masalah:
1. **GitHub Help**: [docs.github.com](https://docs.github.com)
2. **Git Tutorial**: [git-scm.com/docs/gittutorial](https://git-scm.com/docs/gittutorial)
3. **Upload Issues**: Pastikan file size < 100MB per file

---

**🎉 Selamat! Project Anda akan segera tersedia di GitHub!**