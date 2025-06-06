// MongoDB initialization script
db = db.getSiblingDB('cakus');

// Create collections
db.createCollection('umkms');
db.createCollection('users');
db.createCollection('healthreports');

// Create indexes for better performance
db.umkms.createIndex({ "nama_usaha": "text" });
db.umkms.createIndex({ "cluster": 1 });
db.umkms.createIndex({ "risk_level": 1 });
db.umkms.createIndex({ "jenis_usaha": 1 });
db.umkms.createIndex({ "createdAt": -1 });

// Insert sample data for testing
db.umkms.insertMany([
  {
    nama_usaha: "Warung Makan Sederhana",
    jenis_usaha: "Makanan & Minuman",
    tenaga_kerja_perempuan: 3,
    tenaga_kerja_laki_laki: 2,
    aset: 15000000,
    omset: 8000000,
    laba: 2000000,
    biaya_karyawan: 1500000,
    kapasitas_produksi: 100,
    jumlah_pelanggan: 150,
    tahun_berdiri: 2018,
    marketplace: "Website Sendiri",
    status_legalitas: "Terdaftar",
    kategori_umkm: "Mikro",
    cluster: 0,
    health_score: 45,
    risk_level: "tinggi",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nama_usaha: "Toko Fashion Modern",
    jenis_usaha: "Fashion",
    tenaga_kerja_perempuan: 5,
    tenaga_kerja_laki_laki: 3,
    aset: 45000000,
    omset: 25000000,
    laba: 8000000,
    biaya_karyawan: 4000000,
    kapasitas_produksi: 500,
    jumlah_pelanggan: 800,
    tahun_berdiri: 2015,
    marketplace: "Shopee",
    status_legalitas: "Terdaftar",
    kategori_umkm: "Mikro",
    cluster: 1,
    health_score: 75,
    risk_level: "rendah",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Database initialized successfully!");