// backend/src/controllers/umkmController.js
const UMKM = require('../models/UMKM');
const axios = require('axios');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:8000';

// Create new UMKM
exports.createUMKM = async (req, res) => {
  try {
    const umkmData = {
      ...req.body,
      created_by: req.user?.id
    };

    // Classify UMKM category based on asset and revenue
    umkmData.kategori_umkm = classifyUMKM(umkmData.aset, umkmData.omset);

    const umkm = new UMKM(umkmData);
    await umkm.save();

    // Trigger ML analysis
    try {
      const mlResponse = await axios.post(`${ML_API_URL}/health-check`, {
        umkm_id: umkm._id.toString(),
        umkm_data: umkmData
      });

      // Update UMKM with ML results
      umkm.cluster = mlResponse.data.cluster;
      umkm.health_score = mlResponse.data.health_score;
      umkm.risk_level = mlResponse.data.risk_level;
      await umkm.save();
    } catch (mlError) {
      console.error('ML API error:', mlError);
      // Continue without ML analysis
    }

    res.status(201).json({
      message: 'UMKM created successfully',
      data: umkm
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating UMKM',
      error: error.message
    });
  }
};

// Get all UMKM
exports.getAllUMKM = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, cluster, risk_level } = req.query;
    
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (cluster) {
      query.cluster = parseInt(cluster);
    }
    if (risk_level) {
      query.risk_level = risk_level;
    }

    const umkms = await UMKM.find(query)
      .populate('created_by', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await UMKM.countDocuments(query);

    res.json({
      data: umkms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching UMKM data',
      error: error.message
    });
  }
};

// Get UMKM by ID
exports.getUMKMById = async (req, res) => {
  try {
    const umkm = await UMKM.findById(req.params.id)
      .populate('created_by', 'username email');
    
    if (!umkm) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    res.json({ data: umkm });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching UMKM',
      error: error.message
    });
  }
};

// Update UMKM
exports.updateUMKM = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Reclassify UMKM if financial data changed
    if (updateData.aset || updateData.omset) {
      const umkm = await UMKM.findById(req.params.id);
      const aset = updateData.aset || umkm.aset;
      const omset = updateData.omset || umkm.omset;
      updateData.kategori_umkm = classifyUMKM(aset, omset);
    }

    const umkm = await UMKM.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!umkm) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    // Trigger ML re-analysis for significant changes
    if (updateData.aset || updateData.omset || updateData.kapasitas_produksi) {
      try {
        const mlResponse = await axios.post(`${ML_API_URL}/health-check`, {
          umkm_id: umkm._id.toString(),
          umkm_data: umkm.toObject()
        });

        umkm.cluster = mlResponse.data.cluster;
        umkm.health_score = mlResponse.data.health_score;
        umkm.risk_level = mlResponse.data.risk_level;
        await umkm.save();
      } catch (mlError) {
        console.error('ML API error:', mlError);
      }
    }

    res.json({
      message: 'UMKM updated successfully',
      data: umkm
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating UMKM',
      error: error.message
    });
  }
};

// Delete UMKM
exports.deleteUMKM = async (req, res) => {
  try {
    const umkm = await UMKM.findByIdAndDelete(req.params.id);
    
    if (!umkm) {
      return res.status(404).json({ message: 'UMKM not found' });
    }

    res.json({ message: 'UMKM deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting UMKM',
      error: error.message
    });
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUMKM = await UMKM.countDocuments();
    const clusterStats = await UMKM.aggregate([
      {
        $group: {
          _id: '$cluster',
          count: { $sum: 1 },
          avgHealthScore: { $avg: '$health_score' }
        }
      }
    ]);

    const riskLevelStats = await UMKM.aggregate([
      {
        $group: {
          _id: '$risk_level',
          count: { $sum: 1 }
        }
      }
    ]);

    const jenisUsahaStats = await UMKM.aggregate([
      {
        $group: {
          _id: '$jenis_usaha',
          count: { $sum: 1 },
          avgOmset: { $avg: '$omset' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUMKM,
      clusterStats,
      riskLevelStats,
      jenisUsahaStats
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Helper function to classify UMKM
function classifyUMKM(aset, omset) {
  const KRITERIA_MIKRO_ASET = 50000000;
  const KRITERIA_MIKRO_OMSET = 300000000;
  const KRITERIA_KECIL_ASET = 500000000;
  const KRITERIA_KECIL_OMSET = 2500000000;
  const KRITERIA_MENENGAH_ASET = 10000000000;
  const KRITERIA_MENENGAH_OMSET = 50000000000;

  if (aset <= KRITERIA_MIKRO_ASET || omset <= KRITERIA_MIKRO_OMSET) {
    return 'Mikro';
  } else if (aset <= KRITERIA_KECIL_ASET || omset <= KRITERIA_KECIL_OMSET) {
    return 'Kecil';
  } else if (aset <= KRITERIA_MENENGAH_ASET || omset <= KRITERIA_MENENGAH_OMSET) {
    return 'Menengah';
  } else {
    return 'Lainnya (Besar)';
  }
}