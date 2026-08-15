# Daftar Endpoint Kritis - Jastip Kampus

1. **GET /catalog**
   * **Kenapa kritis:** Pintu yang paling sering diketuk oleh penitip untuk melihat-lihat toko dan barang sebelum memutuskan untuk menitip.

2. **POST /titipan**
   * **Kenapa kritis:** Ini adalah titik sumber daya rebutan! Mengisi kapasitas bawaan penjastip yang sangat terbatas. Harus dikunci dengan benar agar kapasitas tidak minus atau *overload*.

3. **POST /payments**
   * **Kenapa kritis:** Melibatkan uang (menahan atau melepaskan saldo penitip). Kegagalan di sini bisa berakibat fatal pada kepercayaan pengguna.