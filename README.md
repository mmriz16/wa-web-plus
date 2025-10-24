# WA Web Plus - Chrome Extension

🚀 **Extension Chrome untuk meningkatkan pengalaman WhatsApp Web dengan fitur-fitur tambahan yang berguna.**

## ✨ Fitur Utama

### 🔒 Hide Mode
- **Blur nama kontak** dan **isi pesan** untuk privasi
- **Toggle ON/OFF** mudah melalui popup extension
- **Hover untuk melihat** - blur hilang saat mouse hover
- **Auto-apply** saat membuka WhatsApp Web

### 🔄 Restore Deleted Messages
- **Tampilkan kembali pesan** yang dihapus dengan "Delete for everyone"
- **Real-time monitoring** pesan masuk
- **Local storage** untuk menyimpan pesan sebelum dihapus
- **Visual indicator** untuk pesan yang di-restore
- **Multi-language support** untuk deteksi pesan terhapus

## 🛠️ Instalasi

### Manual Installation
1. **Download** atau clone repository ini
2. Buka **Chrome** → `chrome://extensions/`
3. Aktifkan **"Developer mode"** di pojok kanan atas
4. Klik **"Load unpacked"**
5. Pilih folder `wawebplus-prototype`
6. Extension siap digunakan! 🎉

### Dari Chrome Web Store
*Coming soon...*

## 📖 Cara Penggunaan

### Hide Mode
1. **Klik icon extension** di toolbar Chrome
2. **Toggle ON** "Hide Mode"
3. Buka **WhatsApp Web** - semua nama dan pesan akan ter-blur
4. **Hover mouse** pada area yang di-blur untuk melihat isi
5. **Toggle OFF** untuk menonaktifkan

### Restore Deleted Messages
1. **Klik icon extension** di toolbar Chrome
2. **Toggle ON** "Restore Deleted Messages"
3. Buka **WhatsApp Web**
4. **Kirim pesan** ke kontak/grup (pesan akan otomatis tersimpan)
5. **Hapus pesan** dengan "Delete for everyone"
6. **Pesan akan muncul kembali** dengan background kuning dan label "🔄 Restored Message"

## 🔧 Fitur Teknis

### Hide Mode
- **CSS Injection** untuk blur effect
- **MutationObserver** untuk auto-apply pada konten dinamis
- **Event listeners** untuk hover interactions
- **Chrome Storage API** untuk persist settings

### Restore Deleted Messages
- **DOM Monitoring** dengan MutationObserver
- **Message Storage** menggunakan Map dan localStorage
- **Unique ID Generation** berdasarkan timestamp + content hash
- **Multi-selector Support** untuk berbagai versi WhatsApp Web
- **Error Handling** dan comprehensive logging

## 📁 Struktur Project

```
wawebplus-prototype/
├── manifest.json          # Extension manifest
├── background.js          # Background script
├── content.js            # Content script (main logic)
├── popup/
│   ├── popup.html        # Extension popup UI
│   └── popup.js          # Popup logic
├── styles/
│   └── hide.css          # CSS untuk hide mode
├── icons/
│   └── icon128.png       # Extension icon
├── .gitignore           # Git ignore file
└── README.md            # Documentation
```

## 🔍 Debug & Troubleshooting

### Console Logs
Buka **Developer Tools** (F12) di WhatsApp Web untuk melihat logs:

```javascript
[WAWebPlus Content] Script loaded
[WAWebPlus Content] Hide mode enabled: true
[WAWebPlus Content] Restore deleted enabled: true
[WAWebPlus Content] Message observer initialized
[WAWebPlus Content] Stored message: [messageId]
[WAWebPlus Content] Found deleted message, attempting to restore...
```

### Common Issues

**Hide Mode tidak berfungsi:**
- Pastikan extension sudah di-reload
- Cek console untuk error messages
- Refresh halaman WhatsApp Web

**Restore Deleted Messages tidak bekerja:**
- Fitur hanya untuk pesan yang diterima **setelah** diaktifkan
- Pastikan pesan sudah tersimpan sebelum dihapus
- Cek console logs untuk debugging info

## ⚠️ Keterbatasan

### Restore Deleted Messages
- ❌ Tidak bisa restore pesan yang dihapus **sebelum** extension aktif
- ❌ Media files (gambar/video) memerlukan handling khusus
- ⚠️ Bergantung pada struktur DOM WhatsApp Web (bisa berubah)

### Privacy & Security
- ✅ Semua data disimpan **lokal** di browser
- ✅ Tidak ada data yang dikirim ke server eksternal
- ✅ Privacy terjaga sepenuhnya

## 🚀 Development

### Prerequisites
- Chrome Browser
- Basic knowledge of JavaScript, HTML, CSS
- Chrome Extensions development

### Setup Development
1. Clone repository
2. Make changes to files
3. Reload extension di `chrome://extensions/`
4. Test di WhatsApp Web

### Contributing
1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Hide Mode dengan blur effect
- ✅ Restore Deleted Messages
- ✅ Popup UI untuk toggle fitur
- ✅ Auto-apply settings
- ✅ Comprehensive error handling
- ✅ Multi-language support

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Support

Jika ada masalah atau pertanyaan:
1. Buka **Issues** di GitHub repository
2. Sertakan **console logs** dan **steps to reproduce**
3. Jelaskan **expected vs actual behavior**

---

**Made with ❤️ for better WhatsApp Web experience**