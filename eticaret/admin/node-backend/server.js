require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 5002;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// MySQL Bağlantısı
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // MySQL şifrenizi .env dosyasında tanımlayın
  database: process.env.DB_NAME || 'eticaret',
};

const pool = mysql.createPool(dbConfig);

// Slider için Multer Ayarları
const FRONTEND_UPLOAD_PATH = path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'upload', 'slider');

const sliderStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(FRONTEND_UPLOAD_PATH, { recursive: true });
      cb(null, FRONTEND_UPLOAD_PATH);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya adı
  },
});

const uploadSlider = multer({ storage: sliderStorage });

// Ürün için Multer Ayarları
const PRODUCT_UPLOAD_PATH = path.join(__dirname, '..', '..', 'public', 'assets', 'images', 'upload', 'product');

const productStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(PRODUCT_UPLOAD_PATH, { recursive: true });
      cb(null, PRODUCT_UPLOAD_PATH);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadProduct = multer({ storage: productStorage });

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [rows] = await pool.execute('SELECT * FROM yonetici WHERE KULLANICI_ADI = ?', [username]);
    const user = rows[0];
    if (user && user.SIFRE === password) res.json({ success: true });
    else res.status(401).json({ success: false, message: 'Geçersiz kullanıcı adı veya parola' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Ana Kategorileri Çekme
app.get('/api/main-categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT kayit_id, kategori_adi FROM ana_kategoriler');
    res.json(rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Alt Kategorileri Ana Kategoriye Göre Çekme
app.get('/api/sub-categories/:mainCategory', async (req, res) => {
  const { mainCategory } = req.params;
  try {
    const [rows] = await pool.execute(
      'SELECT kayit_id, alt_kategori FROM alt_kategoriler WHERE kategori_adi = ? AND gizle = 0',
      [mainCategory]
    );
    res.json(rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Bedenleri Çekme
app.get('/api/sizes', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT kayit_id, beden_adi FROM bedenler');
    res.json(rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Kumaşları Çekme
app.get('/api/fabrics', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT kayit_id, kumas_adi FROM kumaslar');
    res.json(rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Ana Kategori Ekleme
app.post('/api/add-main-category', async (req, res) => {
  const { ana_kategori } = req.body;
  if (!ana_kategori) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    await pool.execute('INSERT INTO ana_kategoriler (kategori_adi) VALUES (?)', [ana_kategori]);
    res.json({ success: true });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Alt Kategori Ekleme
app.post('/api/add-sub-category', async (req, res) => {
  const { kategori_adi, alt_kategori } = req.body;
  if (!kategori_adi || !alt_kategori) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    await pool.execute('INSERT INTO alt_kategoriler (kategori_adi, alt_kategori) VALUES (?, ?)', [
      kategori_adi,
      alt_kategori,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Tüm Alt Kategorileri Çekme
app.get('/api/sub-categories', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT kayit_id, alt_kategori, gizle FROM alt_kategoriler');
    res.json(
      rows.map((row) => ({
        kayit_id: row.kayit_id,
        alt_kategori: row.gizle === 1 ? `${row.alt_kategori} (Gizli)` : row.alt_kategori,
        gizle: row.gizle,
      }))
    );
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Ana Kategori Güncelleme
app.put('/api/update-main-category', async (req, res) => {
  const { kayit_id, new_name } = req.body;
  if (!kayit_id || !new_name) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [oldData] = await pool.execute('SELECT kategori_adi FROM ana_kategoriler WHERE kayit_id = ?', [kayit_id]);
    if (oldData.length === 0) return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    const old_name = oldData[0].kategori_adi;

    const [result] = await pool.execute('UPDATE ana_kategoriler SET kategori_adi = ? WHERE kayit_id = ?', [
      new_name,
      kayit_id,
    ]);
    if (result.affectedRows > 0) {
      await pool.execute('UPDATE alt_kategoriler SET kategori_adi = ? WHERE kategori_adi = ?', [new_name, old_name]);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Ana Kategori Silme
app.delete('/api/delete-main-category', async (req, res) => {
  const { kayit_id } = req.body;
  if (!kayit_id) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [oldData] = await pool.execute('SELECT kategori_adi FROM ana_kategoriler WHERE kayit_id = ?', [kayit_id]);
    if (oldData.length === 0) return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    const kategori_adi = oldData[0].kategori_adi;

    await pool.execute('DELETE FROM alt_kategoriler WHERE kategori_adi = ?', [kategori_adi]);
    const [result] = await pool.execute('DELETE FROM ana_kategoriler WHERE kayit_id = ?', [kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Alt Kategori Güncelleme
app.put('/api/update-sub-category', async (req, res) => {
  const { kayit_id, new_name } = req.body;
  if (!kayit_id || !new_name) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('UPDATE alt_kategoriler SET alt_kategori = ? WHERE kayit_id = ?', [
      new_name,
      kayit_id,
    ]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Alt kategori bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Alt Kategori Gizleme/Gösterme
app.put('/api/hide-sub-category', async (req, res) => {
  const { kayit_id } = req.body;
  if (!kayit_id) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [current] = await pool.execute('SELECT gizle FROM alt_kategoriler WHERE kayit_id = ?', [kayit_id]);
    if (current.length === 0) return res.status(404).json({ success: false, message: 'Alt kategori bulunamadı' });
    const newGizle = current[0].gizle === 0 ? 1 : 0;
    await pool.execute('UPDATE alt_kategoriler SET gizle = ? WHERE kayit_id = ?', [newGizle, kayit_id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Alt Kategori Silme
app.delete('/api/delete-sub-category', async (req, res) => {
  const { kayit_id } = req.body;
  if (!kayit_id) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('DELETE FROM alt_kategoriler WHERE kayit_id = ?', [kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Alt kategori bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Beden Ekleme
app.post('/api/add-size', async (req, res) => {
  const { beden_adi } = req.body;
  if (!beden_adi) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    await pool.execute('INSERT INTO bedenler (beden_adi) VALUES (?)', [beden_adi]);
    res.json({ success: true });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Beden Güncelleme
app.put('/api/update-size', async (req, res) => {
  const { kayit_id, new_name } = req.body;
  if (!kayit_id || !new_name) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('UPDATE bedenler SET beden_adi = ? WHERE kayit_id = ?', [new_name, kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Beden bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Beden Silme
app.delete('/api/delete-size', async (req, res) => {
  const { kayit_id } = req.body;
  if (!kayit_id) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('DELETE FROM bedenler WHERE kayit_id = ?', [kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Beden bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Kumaş Ekleme
app.post('/api/add-fabric', async (req, res) => {
  const { kumas_adi } = req.body;
  if (!kumas_adi) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    await pool.execute('INSERT INTO kumaslar (kumas_adi) VALUES (?)', [kumas_adi]);
    res.json({ success: true });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Kumaş Güncelleme
app.put('/api/update-fabric', async (req, res) => {
  const { kayit_id, new_name } = req.body;
  if (!kayit_id || !new_name) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('UPDATE kumaslar SET kumas_adi = ? WHERE kayit_id = ?', [new_name, kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Kumaş bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Kumaş Silme
app.delete('/api/delete-fabric', async (req, res) => {
  const { kayit_id } = req.body;
  if (!kayit_id) return res.status(400).json({ success: false, message: 'Eksik veri' });
  try {
    const [result] = await pool.execute('DELETE FROM kumaslar WHERE kayit_id = ?', [kayit_id]);
    if (result.affectedRows > 0) res.json({ success: true });
    else res.status(404).json({ success: false, message: 'Kumaş bulunamadı' });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Firma Bilgilerini Çekme
app.get('/api/firma-bilgileri', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM footer LIMIT 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ success: false, message: 'Firma bilgileri bulunamadı' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Firma Bilgilerini Güncelleme
app.put('/api/update-firma-bilgileri', async (req, res) => {
  const { firma_adi, adres, telefon, eposta, facebook, instagram, twitter } = req.body;

  if (!firma_adi || !adres || !telefon || !eposta || !facebook || !instagram || !twitter) {
    return res.status(400).json({ success: false, message: 'Eksik veri' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE footer SET firma_adi = ?, adres = ?, telefon = ?, eposta = ?, facebook = ?, instagram = ?, twitter = ? WHERE kayit_id = 1',
      [firma_adi, adres, telefon, eposta, facebook, instagram, twitter]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Firma bilgileri başarıyla güncellendi' });
    } else {
      res.status(404).json({ success: false, message: 'Firma bilgileri bulunamadı' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Slider’ları Çekme
app.get('/api/sliders', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM slider');
    res.json(rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Yeni Slider Ekleme
app.post('/api/slider', uploadSlider.single('resim'), async (req, res) => {
  const { baslik, buton_link, buton_metni } = req.body;
  const resim = req.file ? req.file.filename : 'default.jpg';

  console.log('Gelen veri:', { resim, baslik, buton_link, buton_metni });
  console.log('Dosya kaydedilen yer:', path.join(FRONTEND_UPLOAD_PATH, resim));

  if (!baslik || !buton_link || !buton_metni) {
    return res.status(400).json({ success: false, message: 'Eksik veri' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO slider (resim, baslik, buton_link, buton_metni) VALUES (?, ?, ?, ?)',
      [resim, baslik, buton_link, buton_metni]
    );

    const sliderData = {
      kayit_id: result.insertId,
      resim,
      baslik,
      buton_link,
      buton_metni,
    };
    res.json({
      success: true,
      data: sliderData,
    });
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ success: false, message: 'Hata: ' + err.message });
  }
});

// Slider Güncelleme
app.put('/api/update-slider', uploadSlider.single('new_resim'), async (req, res) => {
  const { kayit_id, new_baslik, new_buton_link, new_buton_metni } = req.body;
  const new_resim = req.file ? req.file.filename : req.body.new_resim;

  console.log('Gelen veri:', { kayit_id, new_resim, new_baslik, new_buton_link, new_buton_metni });
  if (req.file) {
    console.log('Yeni dosya kaydedilen yer:', path.join(FRONTEND_UPLOAD_PATH, new_resim));
  }

  if (!kayit_id || !new_baslik || !new_buton_link || !new_buton_metni) {
    return res.status(400).json({ success: false, message: 'Eksik veri' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE slider SET resim = ?, baslik = ?, buton_link = ?, buton_metni = ? WHERE kayit_id = ?',
      [new_resim, new_baslik, new_buton_link, new_buton_metni, kayit_id]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Slider başarıyla güncellendi' });
    } else {
      res.status(404).json({ success: false, message: 'Slider bulunamadı' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Slider Silme
app.delete('/api/slider/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM slider WHERE kayit_id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Slider başarıyla silindi' });
    } else {
      res.status(404).json({ success: false, message: 'Slider bulunamadı' });
    }
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Ürün Ekleme
app.post('/api/add-product', uploadProduct.fields([
  { name: 'kapakResim', maxCount: 1 },
  { name: 'digerResimler', maxCount: 10 },
]), async (req, res) => {
  console.log('POST isteği alındı');
  console.log('Gelen body:', req.body);
  console.log('Gelen dosyalar:', req.files);

  const {
    urunKodu,
    urunAdi,
    urunAciklama,
    urunFiyat,
    urunStok,
    urunEtiket,
    cinsiyetSec,
    kumasCinsi,
    anaKategori,
    altKategori,
    beden // Artık 'beden[]' yerine direkt 'beden' kullanıyoruz
  } = req.body;

  const kapak_resim = req.files['kapakResim'] ? req.files['kapakResim'][0].filename : null;
  const varyant_resimler = req.files['digerResimler'] ? req.files['digerResimler'].map(file => file.filename).join(',') : null;

  console.log('Zorunlu alanlar kontrol ediliyor:');
  console.log('urunAdi:', urunAdi);
  console.log('urunFiyat:', urunFiyat);
  console.log('kumasCinsi:', kumasCinsi);
  console.log('anaKategori:', anaKategori);
  console.log('kapak_resim:', kapak_resim);

  if (!urunAdi || !urunFiyat || !kumasCinsi || !anaKategori || !kapak_resim) {
    return res.status(400).json({ success: false, message: 'Zorunlu alanlar eksik: ürün adı, fiyat, kumaş cinsi, ana kategori, kapak resmi' });
  }

  let bedenler = 'Yok'; // Varsayılan değer, çünkü bedenler NOT NULL
  console.log('Ham beden verisi:', beden);
  if (Array.isArray(beden) && beden.length > 0) {
    bedenler = [...new Set(beden)].join(','); // Tekrar edenleri kaldır (S,M,L,S,M,L -> S,M,L)
  } else if (beden && typeof beden === 'string') {
    bedenler = beden;
  }
  console.log('İşlenen bedenler:', bedenler);

  try {
    const [result] = await pool.execute(
      `INSERT INTO urunler (
        urun_kodu, urun_adi, urun_aciklama, fiyat, stok, etiketler, cinsiyet, kumas_cinsi, 
        kapak_resim, varyant_resimler, bedenler, ana_kategori, alt_kategori
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        urunKodu || null,
        urunAdi,
        urunAciklama || null,
        urunFiyat,
        urunStok || null,
        urunEtiket || null,
        cinsiyetSec || null,
        kumasCinsi,
        kapak_resim,
        varyant_resimler || null,
        bedenler, // Varsayılan 'Yok' veya işlenmiş S,M,L
        anaKategori,
        altKategori || null
      ]
    );

    res.json({ success: true, message: 'Ürün başarıyla eklendi', kayit_id: result.insertId });
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Bu ürün kodu zaten kullanılıyor' });
    }
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

//Ürünleri listeleme
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM urunler');
    res.json(rows);
  } catch (err) {
    console.error('Ürünler alınamadı:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

//Ürün silme
app.delete('/api/delete-product/:urunKodu', async (req, res) => {
  const { urunKodu } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM urunler WHERE urun_kodu = ?', [urunKodu]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }
    res.json({ success: true, message: 'Ürün silindi' });
  } catch (err) {
    console.error('Ürün silme hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

//Ürün güncelleme
app.put('/api/update-product/:urunKodu', uploadProduct.fields([
  { name: 'kapakResim', maxCount: 1 },
  { name: 'digerResimler', maxCount: 10 },
]), async (req, res) => {
  const { urunKodu } = req.params;
  const {
    urunAdi, urunAciklama, urunFiyat, urunStok, urunEtiket, cinsiyetSec,
    kumasCinsi, anaKategori, altKategori, bedenler
  } = req.body;

  const kapak_resim = req.files['kapakResim'] ? req.files['kapakResim'][0].filename : null;
  const varyant_resimler = req.files['digerResimler'] ? req.files['digerResimler'].map(file => file.filename).join(',') : null;

  try {
    // Güncellenecek alanları ve değerleri dinamik olarak oluştur
    const updates = {};
    if (urunAdi) updates.urun_adi = urunAdi;
    if (urunAciklama) updates.urun_aciklama = urunAciklama;
    if (urunFiyat) updates.fiyat = urunFiyat;
    if (urunStok) updates.stok = urunStok;
    if (urunEtiket) updates.etiketler = urunEtiket;
    if (cinsiyetSec) updates.cinsiyet = cinsiyetSec;
    if (kumasCinsi) updates.kumas_cinsi = kumasCinsi;
    if (anaKategori) updates.ana_kategori = anaKategori;
    if (altKategori) updates.alt_kategori = altKategori;
    if (bedenler) updates.bedenler = bedenler;
    if (kapak_resim) updates.kapak_resim = kapak_resim;
    if (varyant_resimler) updates.varyant_resimler = varyant_resimler;

    // Eğer güncellenecek bir şey yoksa hata döndür
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Güncellenecek veri yok' });
    }

    // SQL sorgusunu dinamik olarak oluştur
    const setClause = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const [result] = await pool.execute(
      `UPDATE urunler SET ${setClause} WHERE urun_kodu = ?`,
      [...values, urunKodu]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.json({ success: true, message: 'Ürün güncellendi', updatedProduct: { ...updates, urun_kodu: urunKodu } });
  } catch (err) {
    console.error('Güncelleme hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası: ' + err.message });
  }
});

// Bekleyen Siparişler
app.get('/api/orders', async (req, res) => {
  const { durum } = req.query;
  try {
    const [rows] = await pool.execute('SELECT * FROM siparisler WHERE durum = ?', [durum || 'bekliyor']);
    res.json(rows);
  } catch (err) {
    console.error('Siparişler alınamadı:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

// Sipariş bilgilerini çekme
app.get('/api/orders/:siparisNo', async (req, res) => {
  const { siparisNo } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM siparisler WHERE siparis_no = ?', [siparisNo]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Sipariş alınamadı:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

// Sipariş detaylarını çekme
app.get('/api/order-details/:siparisNo', async (req, res) => {
  const { siparisNo } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM siparis_detaylari WHERE siparis_no = ?', [siparisNo]);
    res.json(rows);
  } catch (err) {
    console.error('Sipariş detayları alınamadı:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

// Sipariş durumunu güncelle
app.put('/api/orders/:siparisNo/status', async (req, res) => {
  const { siparisNo } = req.params;
  const { durum } = req.body;

  if (!['bekliyor', 'tamamlandi', 'iptal'].includes(durum)) {
    return res.status(400).json({ success: false, message: 'Geçersiz durum' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE siparisler SET durum = ? WHERE siparis_no = ?',
      [durum, siparisNo]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Sipariş bulunamadı' });
    }
    res.json({ success: true, message: `Sipariş ${durum} olarak güncellendi` });
  } catch (err) {
    console.error('Sipariş güncelleme hatası:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

// İstatistikler

app.get('/api/stats', async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM siparisler) AS toplamSiparis,
        (SELECT COUNT(*) FROM siparisler WHERE durum = 'tamamlandi') AS basariliSiparis,
        (SELECT COUNT(*) FROM siparisler WHERE durum = 'iptal') AS basarisizSiparis,
        (SELECT COUNT(*) FROM urunler) AS toplamUrun,
        (SELECT COUNT(*) FROM uyeler) AS toplamUye,
        (SELECT COUNT(*) FROM siparisler WHERE durum = 'bekliyor') AS bekleyenSiparisler
    `);
    res.json(stats[0]);
  } catch (err) {
    console.error('İstatistikler alınamadı:', err);
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

// Server’ı Başlat
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});