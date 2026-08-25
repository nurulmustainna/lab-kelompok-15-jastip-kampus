# 🔐 LOGIN BUG DEBUG GUIDE

## PENYEBAB BUG & SOLUSI

Telah ditambahkan **debug logging komprehensif** untuk melacak alur login secara mendetail dari awal sampai portal ditampilkan.

## LANGKAH-LANGKAH TESTING

### 1. Buka Browser & Jalankan Development Server

```bash
npm run dev
```

### 2. Buka Browser Console (F12 atau Cmd+Option+I)

```
- Klik tab "Console"
- Pastikan tidak ada filter yang menyembunyikan log
- Jangan refresh halaman selama testing
```

### 3. Test Login dengan Akun Mahasiswa "Aswan"

```
Email/NIM: 105841114532
Password: 453212
```

**Atau** Anda bisa login dengan akun apapun yang terdaftar.

### 4. Perhatikan Console Output

Setiap login akan menampilkan pesan debug seperti ini:

```
🔐 [DEBUG] handleSelectStudent called with: {id, name, role, nim}
✅ [DEBUG] Login success for mahasiswa, setting 500ms timeout before calling onSelectStudent
✅ [DEBUG] 500ms timeout fired, calling onSelectStudent with account: [NAMA]
🔐 [DEBUG] Got userOrders for NIM [NIM]: X orders
🔐 [DEBUG] About to call setViewMode("PORTAL")
🎯 [RENDER] App main render - viewMode: PORTAL userRole: mahasiswa currentStudent: [NAMA]
✅ [DEBUG] onClose called successfully
```

## INTERPRETASI DEBUG LOG

### Jika tidak ada pesan debug sama sekali
**Masalah:** Form tidak disubmit atau handleUnifiedLogin tidak dipanggil
**Solusi:** Periksa apakah ada error lain atau form validation gagal

### Jika hanya muncul "✅ [DEBUG] Login success"
**Masalah:** setTimeout timeout fired, tapi onSelectStudent tidak dipanggil
**Solusi:** Kemungkinan issue dengan callback binding atau closure
**Lihat di console:** Ada error "❌ [ERROR]"?

### Jika muncul "🔐 [DEBUG] handleSelectStudent called" tapi tidak ada "setViewMode"
**Masalah:** handleSelectStudent dijalankan tapi exited sebelum setViewMode
**Solusi:** Ada error di handleSelectStudent, lihat error di console

### Jika ada "❌ [ERROR]" messages
**Masalah:** Exception thrown di dalam callback
**Solusi:** Lihat error message lengkapnya, mungkin ada issue dengan:
- studentOrders structure
- State update
- Order object manipulation

## TEST CASES

### ✅ Test 1: Login as Mahasiswa (Aswan)
```
Input: 105841114532 / 453212
Expected Result:
- Success message: "Login Berhasil! Selamat datang, Aswan."
- Modal closes after 1 second
- Portal appears showing student dashboard
- No error messages in console
```

### ✅ Test 2: Login as Admin
```
Input: kelompok15@gmail.com / kelompok15
Expected Result:
- Success message: "Login Admin Kelompok 15 Berhasil! Mengalihkan..."
- Modal closes
- Admin Dashboard appears (dark theme)
- No error messages in console
```

### ✅ Test 3: Login as Jastiper
```
Input: jasatitip@gmail.com / jasatitip
Expected Result:
- Success message: "Login Mitra Jasa Titip Berhasil! Mengalihkan..."
- Modal closes
- Portal appears with Jastiper Workspace
- No error messages in console
```

### ✅ Test 4: Wrong Password
```
Input: 105841114532 / wrongpassword
Expected Result:
- Error message: "Password salah! Silakan periksa kembali."
- Modal stays open
- Success message should NOT appear
```

### ✅ Test 5: Non-existent Account
```
Input: invalidnim123 / password
Expected Result:
- Error message: "Akun tidak ditemukan. Silakan daftar terlebih dahulu."
- Modal stays open
- Success message should NOT appear
```

## COPY CONSOLE OUTPUT

Setelah test login, ikuti langkah ini:

1. Klik kanan di console
2. Pilih "Save as..." atau "Copy all"
3. Paste ke file atau email
4. Sertakan:
   - Akun apa yang digunakan
   - Pesan error apa yang muncul (jika ada)
   - Apakah portal muncul atau tidak

## JIKA PORTAL TIDAK MUNCUL

Kemungkinan penyebab berdasarkan console log:

| Pesan yang Hilang | Kemungkinan Penyebab |
|-------------------|---------------------|
| Tidak ada debug log sama sekali | handleUnifiedLogin tidak dipanggil, form validation fail |
| Hanya "✅ Login success" | onSelectStudent callback tidak dipanggil (prop binding issue) |
| "🔐 handleSelectStudent" tapi tidak ada "setViewMode" | Error dalam handleSelectStudent (order/state issue) |
| "setViewMode" ada tapi tidak ada "🎯 [RENDER]" | React tidak re-render setelah state change |
| "🎯 [RENDER]" dengan viewMode: LANDING | viewMode tidak berubah ke PORTAL |
| "🎯 [RENDER]" dengan viewMode: PORTAL, tapi portal tidak muncul | Portal rendering issue atau CSS visibility |

## KODE YANG DIMODIFIKASI

### File: `src/components/AuthModal.tsx`
- Ditambahkan debug logging di 3 login paths (admin, jastiper, mahasiswa)
- Ditambahkan try-catch around onSelectStudent dan onClose
- Disimpan account object di variable untuk menghindari closure issues

### File: `src/App.tsx`
- Ditambahkan render logging untuk melacak viewMode/userRole changes
- Ditambahkan debug logging di handleSelectStudent
- Menampilkan order lookup results

## RESET LOGGING (Jika perlu)

Semua console.log yang ditambahkan bersifat **development-only** dan akan:
- Otomatis dihilangkan saat production build
- TIDAK mempengaruhi fungsionalitas aplikasi
- TIDAK menyimpan data logging

Untuk development, semua logging berguna untuk debugging.

## NEXT STEP

1. **Test semua 5 test cases di atas**
2. **Catat console output** untuk setiap test case
3. **Identifikasi pola**:
   - Apakah semua logins gagal atau hanya beberapa?
   - Apakah admin/jastiper login bekerja tapi mahasiswa tidak?
   - Apakah specific account yang gagal atau semua account?
4. **Share console output** untuk analisis lebih lanjut

---

## PERTANYAAN DIAGNOSIS CEPAT

Jawab pertanyaan ini untuk mempercepat diagnosis:

- [ ] Apakah **admin login** (kelompok15@gmail.com) berhasil masuk ke portal?
- [ ] Apakah **jastiper login** (jasatitip@gmail.com) berhasil masuk ke portal?
- [ ] Apakah **mahasiswa login** (akun 105841114532) berhasil masuk ke portal?
- [ ] Apakah ada **error messages** di browser console?
- [ ] Apakah **modal menutup** setelah success message?
- [ ] Apakah halaman **berubah** setelah login attempt (bahkan jika tidak menunjukkan portal)?

Jawaban untuk pertanyaan-pertanyaan ini akan membantu mengidentifikasi apakah masalah bersifat:
- Umum (semua logins gagal)
- Spesifik role (hanya mahasiswa / admin / jastiper gagal)
- Spesifik akun (hanya akun tertentu gagal)
- Partial (modal closes tapi portal tidak muncul)

---

**PENTING:** Debug logging akan membantu kita mengidentifikasi **EXACT POINT** di mana alur login berhenti, sehingga kita dapat membuat targeted fix.
