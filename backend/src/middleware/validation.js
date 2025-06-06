// backend/src/middleware/validation.js
const Joi = require('joi');

const umkmSchema = Joi.object({
  nama_usaha: Joi.string().required().min(3).max(100),
  jenis_usaha: Joi.string().required().valid(
    'Fashion', 'Jasa', 'Kesehatan', 'Makanan & Minuman', 
    'Pendidikan', 'Perdagangan', 'Perusahaan'
  ),
  tenaga_kerja_perempuan: Joi.number().required().min(0).max(100),
  tenaga_kerja_laki_laki: Joi.number().required().min(0).max(100),
  aset: Joi.number().required().min(0),
  omset: Joi.number().required().min(0),
  laba: Joi.number().required().min(0),
  biaya_karyawan: Joi.number().required().min(0),
  kapasitas_produksi: Joi.number().required().min(0),
  jumlah_pelanggan: Joi.number().required().min(0),
  tahun_berdiri: Joi.number().required().min(1990).max(2025),
  marketplace: Joi.string().required().valid(
    'Website Sendiri', 'Bukalapak', 'Lazada', 'Tokopedia', 'Shopee'
  ),
  status_legalitas: Joi.string().required().valid('Terdaftar', 'Belum Terdaftar')
});

exports.validateUMKM = (req, res, next) => {
  const { error } = umkmSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: 'Validation error',
      details: error.details[0].message
    });
  }
  
  next();
};