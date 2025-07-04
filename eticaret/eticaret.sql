-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 15 May 2025, 18:03:43
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `eticaret`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `adresler`
--

CREATE TABLE `adresler` (
  `kayit_id` int(11) NOT NULL,
  `eposta` varchar(255) NOT NULL,
  `adres` varchar(255) NOT NULL,
  `telefon` varchar(255) NOT NULL,
  `il` varchar(100) NOT NULL DEFAULT '',
  `ilce` varchar(100) NOT NULL DEFAULT '',
  `posta_kodu` varchar(10) NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `alt_kategoriler`
--

CREATE TABLE `alt_kategoriler` (
  `kayit_id` int(11) NOT NULL,
  `kategori_adi` varchar(255) NOT NULL,
  `alt_kategori` varchar(255) NOT NULL,
  `gizle` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `alt_kategoriler`
--

INSERT INTO `alt_kategoriler` (`kayit_id`, `kategori_adi`, `alt_kategori`, `gizle`) VALUES
(1, 'Bayan', 'Ceket', 0),
(2, 'Erkek', 'Pantolon', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `ana_kategoriler`
--

CREATE TABLE `ana_kategoriler` (
  `kayit_id` int(11) NOT NULL,
  `kategori_adi` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `ana_kategoriler`
--

INSERT INTO `ana_kategoriler` (`kayit_id`, `kategori_adi`) VALUES
(1, 'Bayan'),
(2, 'Erkek');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `bedenler`
--

CREATE TABLE `bedenler` (
  `kayit_id` int(11) NOT NULL,
  `beden_adi` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `bedenler`
--

INSERT INTO `bedenler` (`kayit_id`, `beden_adi`) VALUES
(6, 'S'),
(7, 'M'),
(8, 'L'),
(9, 'XL');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `footer`
--

CREATE TABLE `footer` (
  `kayit_id` int(11) NOT NULL,
  `adres` varchar(255) NOT NULL,
  `telefon` varchar(255) NOT NULL,
  `eposta` varchar(255) NOT NULL,
  `facebook` varchar(255) NOT NULL,
  `twitter` varchar(255) NOT NULL,
  `instagram` varchar(255) NOT NULL,
  `firma_adi` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `footer`
--

INSERT INTO `footer` (`kayit_id`, `adres`, `telefon`, `eposta`, `facebook`, `twitter`, `instagram`, `firma_adi`) VALUES
(1, 'Yıldız Mahallesi', '0123456789', 'info@modalife.com', 'https://www.facebook.com/modalife', 'https://www.twitter.com/modalife', 'https://www.instagram.com/', 'Modalife');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kumaslar`
--

CREATE TABLE `kumaslar` (
  `kayit_id` int(11) NOT NULL,
  `kumas_adi` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `kumaslar`
--

INSERT INTO `kumaslar` (`kayit_id`, `kumas_adi`) VALUES
(1, 'Pamuk'),
(2, 'Polyester'),
(3, 'Keten'),
(5, 'Koton');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `mesajlar`
--

CREATE TABLE `mesajlar` (
  `id` int(11) NOT NULL,
  `gonderen_eposta` varchar(255) NOT NULL,
  `alici_eposta` varchar(255) NOT NULL,
  `urun_kodu` varchar(50) NOT NULL,
  `mesaj` text NOT NULL,
  `zaman` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `siparisler`
--

CREATE TABLE `siparisler` (
  `id` int(11) NOT NULL,
  `siparis_no` varchar(11) NOT NULL,
  `eposta` varchar(255) NOT NULL,
  `toplam` decimal(10,2) NOT NULL,
  `tarih` datetime NOT NULL,
  `adres` text NOT NULL,
  `telefon` varchar(20) NOT NULL,
  `durum` enum('bekliyor','tamamlandi','iptal') DEFAULT 'bekliyor',
  `il` varchar(100) DEFAULT '',
  `ilce` varchar(100) DEFAULT '',
  `posta_kodu` varchar(10) DEFAULT '',
  `stripe_charge_id` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `siparis_detaylari`
--

CREATE TABLE `siparis_detaylari` (
  `id` int(11) NOT NULL,
  `siparis_no` varchar(11) NOT NULL,
  `urun_kodu` varchar(50) NOT NULL,
  `urun_adi` varchar(255) NOT NULL,
  `fiyat` decimal(10,2) NOT NULL,
  `miktar` int(11) NOT NULL,
  `beden` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `slider`
--

CREATE TABLE `slider` (
  `kayit_id` int(11) NOT NULL,
  `resim` varchar(255) NOT NULL,
  `baslik` varchar(255) NOT NULL,
  `buton_link` varchar(255) NOT NULL,
  `buton_metni` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `slider`
--

INSERT INTO `slider` (`kayit_id`, `resim`, `baslik`, `buton_link`, `buton_metni`) VALUES
(1, '1743373730280.webp', 'Deneme Slider', 'https://www.google.com', 'TIKLA!!!');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urunler`
--

CREATE TABLE `urunler` (
  `kayit_id` int(11) NOT NULL,
  `urun_kodu` varchar(255) NOT NULL,
  `urun_adi` varchar(255) NOT NULL,
  `urun_aciklama` varchar(255) NOT NULL,
  `fiyat` varchar(255) NOT NULL,
  `etiketler` varchar(255) NOT NULL,
  `kumas_cinsi` varchar(255) NOT NULL,
  `cinsiyet` varchar(255) NOT NULL,
  `kapak_resim` varchar(255) NOT NULL,
  `varyant_resimler` varchar(255) DEFAULT NULL,
  `bedenler` varchar(255) NOT NULL,
  `ana_kategori` varchar(255) NOT NULL,
  `alt_kategori` varchar(255) NOT NULL,
  `stok` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `urunler`
--

INSERT INTO `urunler` (`kayit_id`, `urun_kodu`, `urun_adi`, `urun_aciklama`, `fiyat`, `etiketler`, `kumas_cinsi`, `cinsiyet`, `kapak_resim`, `varyant_resimler`, `bedenler`, `ana_kategori`, `alt_kategori`, `stok`) VALUES
(1, 'A123456', 'Erkek Açık Mavi Kot Pantolon', 'Erkek açık mavi kot pantolon.', '4500', 'erkek pantolon, açık mavi pantolon, kot pantolon, erkek kot pantolon', 'Koton', 'Erkek', '1747324790024-872010655.jpg', NULL, 'S,M,L', 'Erkek', 'Pantolon', 100),
(2, 'A654321', 'Bayan Siyah Oversize Blazer Ceket', 'Bayan Siyah Oversize Blazer Ceket', '6500', 'ceket, bayan ceket, siyah ceket, blazer ceket, oversize ceket', 'Pamuk', 'Kadın', '1747324918688-190455958.jpg', '1747324918688-707298679.jpg', 'S,M,L', 'Bayan', 'Ceket', 100);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `uyeler`
--

CREATE TABLE `uyeler` (
  `kayit_id` int(11) NOT NULL,
  `adsoyad` varchar(255) NOT NULL,
  `eposta` varchar(255) NOT NULL,
  `sifre` varchar(255) NOT NULL,
  `onesignal_player_id` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yonetici`
--

CREATE TABLE `yonetici` (
  `ID` int(11) NOT NULL,
  `KULLANICI_ADI` varchar(50) NOT NULL,
  `SIFRE` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Tablo döküm verisi `yonetici`
--

INSERT INTO `yonetici` (`ID`, `KULLANICI_ADI`, `SIFRE`) VALUES
(1, 'admin', '12345');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yorumlar`
--

CREATE TABLE `yorumlar` (
  `kayit_id` int(11) NOT NULL,
  `urun_kodu` varchar(255) NOT NULL,
  `yorum_yapan_eposta` varchar(255) NOT NULL,
  `yorum` varchar(255) NOT NULL,
  `zaman` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_turkish_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `adresler`
--
ALTER TABLE `adresler`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `eposta` (`eposta`);

--
-- Tablo için indeksler `alt_kategoriler`
--
ALTER TABLE `alt_kategoriler`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `ana_kategoriler`
--
ALTER TABLE `ana_kategoriler`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `bedenler`
--
ALTER TABLE `bedenler`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `footer`
--
ALTER TABLE `footer`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `kumaslar`
--
ALTER TABLE `kumaslar`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `mesajlar`
--
ALTER TABLE `mesajlar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gonderen_eposta` (`gonderen_eposta`),
  ADD KEY `alici_eposta` (`alici_eposta`),
  ADD KEY `urun_kodu` (`urun_kodu`);

--
-- Tablo için indeksler `siparisler`
--
ALTER TABLE `siparisler`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `siparis_no` (`siparis_no`);

--
-- Tablo için indeksler `siparis_detaylari`
--
ALTER TABLE `siparis_detaylari`
  ADD PRIMARY KEY (`id`),
  ADD KEY `siparis_no` (`siparis_no`);

--
-- Tablo için indeksler `slider`
--
ALTER TABLE `slider`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Tablo için indeksler `urunler`
--
ALTER TABLE `urunler`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `urun_kodu` (`urun_kodu`);

--
-- Tablo için indeksler `uyeler`
--
ALTER TABLE `uyeler`
  ADD PRIMARY KEY (`kayit_id`),
  ADD UNIQUE KEY `eposta` (`eposta`);

--
-- Tablo için indeksler `yonetici`
--
ALTER TABLE `yonetici`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `KULLANICI_ADI` (`KULLANICI_ADI`);

--
-- Tablo için indeksler `yorumlar`
--
ALTER TABLE `yorumlar`
  ADD PRIMARY KEY (`kayit_id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `adresler`
--
ALTER TABLE `adresler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `alt_kategoriler`
--
ALTER TABLE `alt_kategoriler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `ana_kategoriler`
--
ALTER TABLE `ana_kategoriler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `bedenler`
--
ALTER TABLE `bedenler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Tablo için AUTO_INCREMENT değeri `footer`
--
ALTER TABLE `footer`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `kumaslar`
--
ALTER TABLE `kumaslar`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `mesajlar`
--
ALTER TABLE `mesajlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `siparisler`
--
ALTER TABLE `siparisler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `siparis_detaylari`
--
ALTER TABLE `siparis_detaylari`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `slider`
--
ALTER TABLE `slider`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `urunler`
--
ALTER TABLE `urunler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `uyeler`
--
ALTER TABLE `uyeler`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `yonetici`
--
ALTER TABLE `yonetici`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `yorumlar`
--
ALTER TABLE `yorumlar`
  MODIFY `kayit_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
