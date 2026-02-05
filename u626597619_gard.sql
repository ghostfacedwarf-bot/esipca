-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 05, 2026 at 03:00 PM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u626597619_gard`
--

-- --------------------------------------------------------

--
-- Table structure for table `CartItem`
--

CREATE TABLE `CartItem` (
  `id` varchar(191) NOT NULL,
  `sessionId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`id`, `name`, `slug`, `description`, `image`, `parentId`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cat_sipca', 'Șipcă Metalică', 'sipca-metalica-galati', 'Șipcă metalică din oțel zincat DX 51 vopsit în câmp electrostatic. Profile P1-P27 cu diverse culori RAL. Ideală pentru garduri moderne și rezistente.', NULL, NULL, 1, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000');

-- --------------------------------------------------------

--
-- Table structure for table `Chat`
--

CREATE TABLE `Chat` (
  `id` varchar(191) NOT NULL,
  `sessionId` varchar(191) NOT NULL,
  `visitorName` varchar(191) DEFAULT NULL,
  `visitorEmail` varchar(191) DEFAULT NULL,
  `visitorLang` varchar(191) NOT NULL DEFAULT 'ro',
  `status` varchar(191) NOT NULL DEFAULT 'active',
  `unreadCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ChatMessage`
--

CREATE TABLE `ChatMessage` (
  `id` varchar(191) NOT NULL,
  `chatId` varchar(191) NOT NULL,
  `sender` varchar(191) NOT NULL,
  `originalText` varchar(191) NOT NULL,
  `translatedText` varchar(191) DEFAULT NULL,
  `originalLang` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Media`
--

CREATE TABLE `Media` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `alt` varchar(191) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Media`
--

INSERT INTO `Media` (`id`, `productId`, `url`, `alt`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
('m1', 'prod_p1_7024', '/images/products/Sipca Metalica P1 7024 MAT.jpg', 'Șipcă P1', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m10', 'prod_p10_7024', '/images/products/Sipca Metalica P10 7024 MAT.jpg', 'Șipcă P10', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m11', 'prod_p11_5010', '/images/products/Sipca Metalica P11 5010 LUCIOS.jpg', 'Șipcă P11', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m12', 'prod_p12_8017', '/images/products/Sipca Metalica P12 8017 MAT.jpg', 'Șipcă P12', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m13', 'prod_p13_stejar', '/images/products/Sipca Metalica P13 Stejar.jpg', 'Șipcă P13', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m14', 'prod_p14_8019', '/images/products/Sipca Metalica P14 8019 MAT.jpg', 'Șipcă P14', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m15', 'prod_p15_3011', '/images/products/Sipca Metalica P15 3011 LUCIOS.jpg', 'Șipcă P15', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m16', 'prod_p16_8017', '/images/products/Sipca Metalica P16 8017 LUCIOS.jpg', 'Șipcă P16', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m17', 'prod_p17_8004', '/images/products/Sipca Metalica P17 8004 MAT.jpg', 'Șipcă P17', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m18', 'prod_p18_9005', '/images/products/Sipca Metalica P18 9005 MAT.jpg', 'Șipcă P18', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m19', 'prod_p19_7024', '/images/products/Sipca Metalica P19 7024 MAT.jpg', 'Șipcă P19', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m2', 'prod_p2_zincat', '/images/products/Sipca Metalica P2 Zincat.jpg', 'Șipcă P2', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m20', 'prod_p20_zincat', '/images/products/Sipca Metalica P20 Zincat.jpg', 'Șipcă P20', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m21', 'prod_p21_8017', '/images/products/Sipca Metalica P21 8017 MAT.jpg', 'Șipcă P21', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m22', 'prod_p22_stejar', '/images/products/Sipca Metalica P22 Stejar.jpg', 'Șipcă P22', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m23', 'prod_p23_8019', '/images/products/Sipca Metalica P23 8019 MAT.jpg', 'Șipcă P23', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m24', 'prod_p24_3011', '/images/products/Sipca Metalica P24 3011 LUCIOS.jpg', 'Șipcă P24', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m25', 'prod_p25_8017', '/images/products/Sipca Metalica P25 8017 LUCIOS.jpg', 'Șipcă P25', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m26', 'prod_p26_8004', '/images/products/Sipca Metalica P26 8004 MAT.jpg', 'Șipcă P26', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m27', 'prod_p27_9005', '/images/products/Sipca Metalica P27 9005 MAT.jpg', 'Șipcă P27', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m3', 'prod_p3_8017', '/images/products/Sipca Metalica P3 8017 MAT.jpg', 'Șipcă P3', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m4', 'prod_p4_stejar', '/images/products/Sipca Metalica P4 Stejar.jpg', 'Șipcă P4', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m5', 'prod_p5_8019', '/images/products/Sipca Metalica P5 8019 MAT.jpg', 'Șipcă P5', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m6', 'prod_p6_3011', '/images/products/Sipca Metalica P6 3011 LUCIOS.jpg', 'Șipcă P6', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m7', 'prod_p7_8017', '/images/products/Sipca Metalica P7 8017 LUCIOS.jpg', 'Șipcă P7', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m8', 'prod_p8_8004', '/images/products/Sipca Metalica P8 8004 MAT.jpg', 'Șipcă P8', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000'),
('m9', 'prod_p9_9005', '/images/products/Sipca Metalica P9 9005 MAT.jpg', 'Șipcă P9', 0, '2026-02-04 19:27:17.000', '2026-02-04 19:27:17.000');

-- --------------------------------------------------------

--
-- Table structure for table `Order`
--

CREATE TABLE `Order` (
  `id` varchar(191) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `customerName` varchar(191) NOT NULL,
  `customerEmail` varchar(191) NOT NULL,
  `customerPhone` varchar(191) NOT NULL,
  `customerAddress` varchar(191) DEFAULT NULL,
  `customerCity` varchar(191) DEFAULT NULL,
  `customerCounty` varchar(191) DEFAULT NULL,
  `customerPostal` varchar(191) DEFAULT NULL,
  `message` varchar(191) DEFAULT NULL,
  `estimatedTotal` double DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'pending',
  `paymentMethod` varchar(191) NOT NULL DEFAULT 'email_request',
  `notes` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `OrderItem`
--

CREATE TABLE `OrderItem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `shortDescription` varchar(191) DEFAULT NULL,
  `longDescription` varchar(191) DEFAULT NULL,
  `categoryId` varchar(191) NOT NULL,
  `priceFrom` double NOT NULL,
  `discountPercent` double NOT NULL DEFAULT 0,
  `priceType` varchar(191) NOT NULL DEFAULT 'per_piece',
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isBestseller` tinyint(1) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Product`
--

INSERT INTO `Product` (`id`, `name`, `slug`, `shortDescription`, `longDescription`, `categoryId`, `priceFrom`, `discountPercent`, `priceType`, `specs`, `isFeatured`, `isBestseller`, `isActive`, `createdAt`, `updatedAt`) VALUES
('prod_p1_7024', 'Șipcă Metalică P1 - 7024 MAT', 'sipca-metalica-p1-7024-mat', 'P1 - Culoare 7024 Negru - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 7024 Negru - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.35, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P1\",\"culoare\":\"7024 Negru\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 1, 1, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p10_7024', 'Șipcă Metalică P10 - 7024 MAT', 'sipca-metalica-p10-7024-mat', 'P10 - Culoare 7024 Negru - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 7024 Negru - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P10\",\"culoare\":\"7024 Negru\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p11_5010', 'Șipcă Metalică P11 - 5010 LUCIOS', 'sipca-metalica-p11-5010-lucios', 'P11 - Culoare 5010 Albastru - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 5010 Albastru - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.15, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P11\",\"culoare\":\"5010 Albastru\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p12_8017', 'Șipcă Metalică P12 - 8017 MAT', 'sipca-metalica-p12-8017-mat', 'P12 - Culoare 8017 Maro - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P12\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p13_stejar', 'Șipcă Metalică P13 - Stejar (3D)', 'sipca-metalica-p13-stejar', 'P13 - Culoare Stejar (aspect lemn) - Finisaj 3D Lemn', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: Stejar (aspect lemn) - Finisaj: 3D Lemn. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 7.45, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P13\",\"culoare\":\"Stejar (aspect lemn)\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"3D Lemn\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p14_8019', 'Șipcă Metalică P14 - 8019 MAT', 'sipca-metalica-p14-8019-mat', 'P14 - Culoare 8019 Negru intens - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8019 Negru intens - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.95, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P14\",\"culoare\":\"8019 Negru intens\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p15_3011', 'Șipcă Metalică P15 - 3011 LUCIOS', 'sipca-metalica-p15-3011-lucios', 'P15 - Culoare 3011 Roșu-maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 3011 Roșu-maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.05, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P15\",\"culoare\":\"3011 Roșu-maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p16_8017', 'Șipcă Metalică P16 - 8017 LUCIOS', 'sipca-metalica-p16-8017-lucios', 'P16 - Culoare 8017 Maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.05, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P16\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p17_8004', 'Șipcă Metalică P17 - 8004 MAT', 'sipca-metalica-p17-8004-mat', 'P17 - Culoare 8004 Negru pur - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8004 Negru pur - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P17\",\"culoare\":\"8004 Negru pur\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p18_9005', 'Șipcă Metalică P18 - 9005 MAT', 'sipca-metalica-p18-9005-mat', 'P18 - Culoare 9005 Negru profund - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 9005 Negru profund - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P18\",\"culoare\":\"9005 Negru profund\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p19_7024', 'Șipcă Metalică P19 - 7024 MAT', 'sipca-metalica-p19-7024-mat', 'P19 - Culoare 7024 Negru - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 7024 Negru - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.85, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P19\",\"culoare\":\"7024 Negru\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p2_zincat', 'Șipcă Metalică P2 - Zincat (AL ZN)', 'sipca-metalica-p2-zincat', 'P2 - Culoare Zincat natural - Finisaj Aluminiu-Zinc', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: Zincat natural - Finisaj: Aluminiu-Zinc. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 4.85, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P2\",\"culoare\":\"Zincat natural\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Aluminiu-Zinc\",\"bucinPerMetru\":\"10\"}', 1, 1, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p20_zincat', 'Șipcă Metalică P20 - Zincat (AL ZN)', 'sipca-metalica-p20-zincat', 'P20 - Culoare Zincat natural - Finisaj Aluminiu-Zinc', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: Zincat natural - Finisaj: Aluminiu-Zinc. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.05, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P20\",\"culoare\":\"Zincat natural\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Aluminiu-Zinc\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p21_8017', 'Șipcă Metalică P21 - 8017 MAT', 'sipca-metalica-p21-8017-mat', 'P21 - Culoare 8017 Maro - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.85, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P21\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p22_stejar', 'Șipcă Metalică P22 - Stejar (3D)', 'sipca-metalica-p22-stejar', 'P22 - Culoare Stejar (aspect lemn) - Finisaj 3D Lemn', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: Stejar (aspect lemn) - Finisaj: 3D Lemn. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.95, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P22\",\"culoare\":\"Stejar (aspect lemn)\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"3D Lemn\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p23_8019', 'Șipcă Metalică P23 - 8019 MAT', 'sipca-metalica-p23-8019-mat', 'P23 - Culoare 8019 Negru intens - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8019 Negru intens - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.15, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P23\",\"culoare\":\"8019 Negru intens\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p24_3011', 'Șipcă Metalică P24 - 3011 LUCIOS', 'sipca-metalica-p24-3011-lucios', 'P24 - Culoare 3011 Roșu-maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 3011 Roșu-maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.35, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P24\",\"culoare\":\"3011 Roșu-maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p25_8017', 'Șipcă Metalică P25 - 8017 LUCIOS', 'sipca-metalica-p25-8017-lucios', 'P25 - Culoare 8017 Maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.35, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P25\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p26_8004', 'Șipcă Metalică P26 - 8004 MAT', 'sipca-metalica-p26-8004-mat', 'P26 - Culoare 8004 Negru pur - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8004 Negru pur - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.85, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P26\",\"culoare\":\"8004 Negru pur\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p27_9005', 'Șipcă Metalică P27 - 9005 MAT', 'sipca-metalica-p27-9005-mat', 'P27 - Culoare 9005 Negru profund - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 9005 Negru profund - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.15, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P27\",\"culoare\":\"9005 Negru profund\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p3_8017', 'Șipcă Metalică P3 - 8017 MAT', 'sipca-metalica-p3-8017-mat', 'P3 - Culoare 8017 Maro - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P3\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p4_stejar', 'Șipcă Metalică P4 - Stejar (3D)', 'sipca-metalica-p4-stejar', 'P4 - Culoare Stejar (aspect lemn) - Finisaj 3D Lemn', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: Stejar (aspect lemn) - Finisaj: 3D Lemn. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 6.75, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P4\",\"culoare\":\"Stejar (aspect lemn)\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"3D Lemn\",\"bucinPerMetru\":\"10\"}', 1, 1, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p5_8019', 'Șipcă Metalică P5 - 8019 MAT', 'sipca-metalica-p5-8019-mat', 'P5 - Culoare 8019 Negru intens - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8019 Negru intens - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P5\",\"culoare\":\"8019 Negru intens\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p6_3011', 'Șipcă Metalică P6 - 3011 LUCIOS', 'sipca-metalica-p6-3011-lucios', 'P6 - Culoare 3011 Roșu-maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 3011 Roșu-maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.15, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P6\",\"culoare\":\"3011 Roșu-maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p7_8017', 'Șipcă Metalică P7 - 8017 LUCIOS', 'sipca-metalica-p7-8017-lucios', 'P7 - Culoare 8017 Maro - Finisaj Lucios', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8017 Maro - Finisaj: Lucios. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.15, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P7\",\"culoare\":\"8017 Maro\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Lucios\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p8_8004', 'Șipcă Metalică P8 - 8004 MAT', 'sipca-metalica-p8-8004-mat', 'P8 - Culoare 8004 Negru pur - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 8004 Negru pur - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P8\",\"culoare\":\"8004 Negru pur\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 0, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('prod_p9_9005', 'Șipcă Metalică P9 - 9005 MAT', 'sipca-metalica-p9-9005-mat', 'P9 - Culoare 9005 Negru profund - Finisaj Mat', 'Șipcă metalică DX 51 din tablă zincată (0.45mm × 9cm) - 10 buc/metru. Culoare: 9005 Negru profund - Finisaj: Mat. Garanție 30 ani, transport gratuit, retur 30 zile.', 'cat_sipca', 5.65, 0, 'per_meter', '{\"material\":\"Tablă zincată DX 51\",\"profil\":\"P9\",\"culoare\":\"9005 Negru profund\",\"grosime\":\"0.45 mm\",\"latime\":\"9 cm\",\"finisaj\":\"Mat\",\"bucinPerMetru\":\"10\"}', 1, 0, 1, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000');

-- --------------------------------------------------------

--
-- Table structure for table `Review`
--

CREATE TABLE `Review` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `text` varchar(191) DEFAULT NULL,
  `isApproved` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Review`
--

INSERT INTO `Review` (`id`, `productId`, `name`, `email`, `rating`, `text`, `isApproved`, `createdAt`, `updatedAt`) VALUES
('rev_1', 'prod_p1_7024', 'Ion Popescu', 'ion@exemplu.ro', 5, 'Șipcă de foarte bună calitate! Perfect pentru gardul meu. Recomand cu încredere!', 1, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('rev_2', 'prod_p9_9005', 'Gheorghe Mărgărit', 'gheorghe@exemplu.ro', 5, 'Livrare rapidă, produsul corespunde perfect descrisului. Mulțumesc pentru profesionalism!', 1, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000');

-- --------------------------------------------------------

--
-- Table structure for table `Settings`
--

CREATE TABLE `Settings` (
  `id` varchar(191) NOT NULL DEFAULT 'default',
  `companyName` varchar(191) NOT NULL DEFAULT 'Esipca Metalica',
  `companyAddress` varchar(191) NOT NULL DEFAULT 'Galati, DN26 Nr 19',
  `companyPhone` varchar(191) NOT NULL DEFAULT '+40 (722) 292 519',
  `companyEmail` varchar(191) NOT NULL DEFAULT 'clienti@metalfence.ro',
  `freeShippingThreshold` double NOT NULL DEFAULT 350,
  `warrantyYears` int(11) NOT NULL DEFAULT 30,
  `deliveryDays` varchar(191) NOT NULL DEFAULT '1-7',
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Settings`
--

INSERT INTO `Settings` (`id`, `companyName`, `companyAddress`, `companyPhone`, `companyEmail`, `freeShippingThreshold`, `warrantyYears`, `deliveryDays`, `updatedAt`) VALUES
('default', 'Metal Fence', 'Galati, DN26 Nr 19', '+40 (722) 292 519', 'clienti@metalfence.ro', 350, 30, '1-7', '2026-02-04 14:58:52.000');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'admin',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
('admin001', 'admin@metalfence.ro', '$2a$10$rQqy8wMGmOXJG8n3mXzA8OuGvJvmxQQp1QnVK1zXUxYvK8XrVvG2K', 'Administrator', 'admin', '2026-02-04 14:58:52.000', '2026-02-04 14:58:52.000');

-- --------------------------------------------------------

--
-- Table structure for table `Variant`
--

CREATE TABLE `Variant` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `sku` varchar(191) NOT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`attributes`)),
  `price` double NOT NULL,
  `priceEU` double DEFAULT NULL,
  `stockStatus` varchar(191) NOT NULL DEFAULT 'in_stock',
  `stockQty` int(11) NOT NULL DEFAULT 9999,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `Variant`
--

INSERT INTO `Variant` (`id`, `productId`, `sku`, `attributes`, `price`, `priceEU`, `stockStatus`, `stockQty`, `createdAt`, `updatedAt`) VALUES
('var_prod_p1_7024_06', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.61, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_08', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_10', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.68, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_12', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_15', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_18', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_20', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_24', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p1_7024_30', 'prod_p1_7024', 'sipca-metalica-p1-7024-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_06', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_08', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_10', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_12', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_15', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.77, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_18', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.72, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_20', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_24', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.63, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p10_7024_30', 'prod_p10_7024', 'sipca-metalica-p10-7024-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_06', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_08', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_10', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.93, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_12', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.52, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_15', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.4, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_18', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.27, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_20', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_24', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.03, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p11_5010_30', 'prod_p11_5010', 'sipca-metalica-p11-5010-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.79, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_06', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_08', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_10', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_12', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_15', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.77, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_18', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.72, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_20', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_24', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.63, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p12_8017_30', 'prod_p12_8017', 'sipca-metalica-p12-8017-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_06', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-0.6m', '{\"inaltime\":\"0.6 m\"}', 2.15, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_08', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_10', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.58, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_12', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-1.2m', '{\"inaltime\":\"1.2 m\"}', 4.3, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_15', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-1.5m', '{\"inaltime\":\"1.5 m\"}', 5.37, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_18', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-1.8m', '{\"inaltime\":\"1.8 m\"}', 6.44, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_20', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-2.0m', '{\"inaltime\":\"2.0 m\"}', 7.16, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_24', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-2.4m', '{\"inaltime\":\"2.4 m\"}', 8.59, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p13_stejar_30', 'prod_p13_stejar', 'sipca-metalica-p13-stejar-3.0m', '{\"inaltime\":\"3.0 m\"}', 10.74, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_06', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 2, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_08', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.66, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_10', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.33, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_12', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 4, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_15', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 5, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_18', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_20', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.66, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_24', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p14_8019_30', 'prod_p14_8019', 'sipca-metalica-p14-8019-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_06', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.73, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_08', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.3, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_10', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.88, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_12', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.46, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_15', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.32, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_18', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_20', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_24', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p15_3011_30', 'prod_p15_3011', 'sipca-metalica-p15-3011-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.64, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_06', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.73, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_08', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.3, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_10', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.88, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_12', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.46, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_15', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.32, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_18', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_20', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_24', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p16_8017_30', 'prod_p16_8017', 'sipca-metalica-p16-8017-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.64, NULL, 'in_stock', 9999, '2026-02-04 15:04:52.000', '2026-02-04 15:04:52.000'),
('var_prod_p17_8004_06', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_08', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_10', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_12', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_15', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.77, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_18', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.72, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_20', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_24', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.63, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p17_8004_30', 'prod_p17_8004', 'sipca-metalica-p17-8004-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_06', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.91, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_08', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_10', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.18, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_12', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_15', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.77, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_18', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.72, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_20', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_24', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.63, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p18_9005_30', 'prod_p18_9005', 'sipca-metalica-p18-9005-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.54, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_06', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_08', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_10', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.78, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_12', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_15', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.17, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_18', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_20', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.56, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_24', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p19_7024_30', 'prod_p19_7024', 'sipca-metalica-p19-7024-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_06', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.37, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_08', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-0.8m', '{\"inaltime\":\"0.8 m\"}', 1.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_10', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.28, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_12', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-1.2m', '{\"inaltime\":\"1.2 m\"}', 2.74, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_15', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.42, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_18', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.1, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_20', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-2.0m', '{\"inaltime\":\"2.0 m\"}', 4.56, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_24', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-2.4m', '{\"inaltime\":\"2.4 m\"}', 5.47, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p2_zincat_30', 'prod_p2_zincat', 'sipca-metalica-p2-zincat-3.0m', '{\"inaltime\":\"3.0 m\"}', 6.84, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_06', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_08', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-0.8m', '{\"inaltime\":\"0.8 m\"}', 1.9, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_10', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.38, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_12', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-1.2m', '{\"inaltime\":\"1.2 m\"}', 2.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_15', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.57, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_18', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.28, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_20', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-2.0m', '{\"inaltime\":\"2.0 m\"}', 4.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_24', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-2.4m', '{\"inaltime\":\"2.4 m\"}', 5.71, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p20_zincat_30', 'prod_p20_zincat', 'sipca-metalica-p20-zincat-3.0m', '{\"inaltime\":\"3.0 m\"}', 7.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_06', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_08', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_10', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.78, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_12', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_15', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.17, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_18', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_20', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.56, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_24', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p21_8017_30', 'prod_p21_8017', 'sipca-metalica-p21-8017-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_06', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-0.6m', '{\"inaltime\":\"0.6 m\"}', 2, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_08', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.66, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_10', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.33, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_12', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-1.2m', '{\"inaltime\":\"1.2 m\"}', 4, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_15', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-1.5m', '{\"inaltime\":\"1.5 m\"}', 5, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_18', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_20', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.66, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_24', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p22_stejar_30', 'prod_p22_stejar', 'sipca-metalica-p22-stejar-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.99, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_06', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_08', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_10', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.93, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_12', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.52, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_15', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.4, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_18', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.27, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_20', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_24', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.03, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p23_8019_30', 'prod_p23_8019', 'sipca-metalica-p23-8019-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.79, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_06', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.52, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_08', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_10', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.53, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_12', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_15', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.8, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_18', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.55, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_20', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.06, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_24', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.07, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p24_3011_30', 'prod_p24_3011', 'sipca-metalica-p24-3011-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 7.59, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_06', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.52, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_08', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_10', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.53, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_12', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_15', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.8, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_18', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.55, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_20', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.06, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_24', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.07, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p25_8017_30', 'prod_p25_8017', 'sipca-metalica-p25-8017-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 7.59, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_06', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_08', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_10', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.78, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_12', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_15', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.17, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_18', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_20', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.56, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_24', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.67, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p26_8004_30', 'prod_p26_8004', 'sipca-metalica-p26-8004-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_06', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.76, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_08', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.34, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_10', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.93, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_12', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.52, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_15', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.4, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_18', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.27, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_20', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_24', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.03, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p27_9005_30', 'prod_p27_9005', 'sipca-metalica-p27-9005-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.79, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_06', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.61, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_08', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_10', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.68, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_12', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_15', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_18', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_20', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_24', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p3_8017_30', 'prod_p3_8017', 'sipca-metalica-p3-8017-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_06', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.94, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_08', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.58, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_10', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-1.0m', '{\"inaltime\":\"1.0 m\"}', 3.23, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_12', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.88, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_15', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.84, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_18', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-1.8m', '{\"inaltime\":\"1.8 m\"}', 5.81, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_20', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-2.0m', '{\"inaltime\":\"2.0 m\"}', 6.46, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_24', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-2.4m', '{\"inaltime\":\"2.4 m\"}', 7.75, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p4_stejar_30', 'prod_p4_stejar', 'sipca-metalica-p4-stejar-3.0m', '{\"inaltime\":\"3.0 m\"}', 9.69, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_06', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.61, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_08', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_10', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.68, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_12', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_15', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_18', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_20', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_24', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p5_8019_30', 'prod_p5_8019', 'sipca-metalica-p5-8019-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_06', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.46, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_08', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 1.94, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_10', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_12', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 2.92, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_15', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.65, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_18', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.37, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_20', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 4.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_24', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 5.83, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p6_3011_30', 'prod_p6_3011', 'sipca-metalica-p6-3011-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 7.29, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_06', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.46, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_08', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-0.8m', '{\"inaltime\":\"0.8 m\"}', 1.94, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_10', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_12', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-1.2m', '{\"inaltime\":\"1.2 m\"}', 2.92, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_15', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-1.5m', '{\"inaltime\":\"1.5 m\"}', 3.65, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_18', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.37, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_20', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-2.0m', '{\"inaltime\":\"2.0 m\"}', 4.86, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_24', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-2.4m', '{\"inaltime\":\"2.4 m\"}', 5.83, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p7_8017_30', 'prod_p7_8017', 'sipca-metalica-p7-8017-lucios-3.0m', '{\"inaltime\":\"3.0 m\"}', 7.29, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_06', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.61, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_08', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_10', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.68, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_12', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_15', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_18', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_20', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_24', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p8_8004_30', 'prod_p8_8004', 'sipca-metalica-p8-8004-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_06', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-0.6m', '{\"inaltime\":\"0.6 m\"}', 1.61, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_08', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-0.8m', '{\"inaltime\":\"0.8 m\"}', 2.14, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_10', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-1.0m', '{\"inaltime\":\"1.0 m\"}', 2.68, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_12', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-1.2m', '{\"inaltime\":\"1.2 m\"}', 3.22, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_15', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-1.5m', '{\"inaltime\":\"1.5 m\"}', 4.02, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_18', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-1.8m', '{\"inaltime\":\"1.8 m\"}', 4.82, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_20', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-2.0m', '{\"inaltime\":\"2.0 m\"}', 5.36, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_24', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-2.4m', '{\"inaltime\":\"2.4 m\"}', 6.43, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000'),
('var_prod_p9_9005_30', 'prod_p9_9005', 'sipca-metalica-p9-9005-mat-3.0m', '{\"inaltime\":\"3.0 m\"}', 8.04, NULL, 'in_stock', 9999, '2026-02-04 15:04:53.000', '2026-02-04 15:04:53.000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CartItem`
--
ALTER TABLE `CartItem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `CartItem_sessionId_productId_variantId_key` (`sessionId`,`productId`,`variantId`),
  ADD KEY `CartItem_productId_fkey` (`productId`),
  ADD KEY `CartItem_variantId_fkey` (`variantId`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indexes for table `Chat`
--
ALTER TABLE `Chat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Chat_sessionId_key` (`sessionId`);

--
-- Indexes for table `ChatMessage`
--
ALTER TABLE `ChatMessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ChatMessage_chatId_fkey` (`chatId`);

--
-- Indexes for table `Media`
--
ALTER TABLE `Media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Media_productId_fkey` (`productId`);

--
-- Indexes for table `Order`
--
ALTER TABLE `Order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_orderNumber_key` (`orderNumber`);

--
-- Indexes for table `OrderItem`
--
ALTER TABLE `OrderItem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_orderId_fkey` (`orderId`),
  ADD KEY `OrderItem_productId_fkey` (`productId`),
  ADD KEY `OrderItem_variantId_fkey` (`variantId`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD KEY `Product_categoryId_fkey` (`categoryId`);

--
-- Indexes for table `Review`
--
ALTER TABLE `Review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Review_productId_fkey` (`productId`);

--
-- Indexes for table `Settings`
--
ALTER TABLE `Settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `Variant`
--
ALTER TABLE `Variant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Variant_sku_key` (`sku`),
  ADD KEY `Variant_productId_fkey` (`productId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `CartItem`
--
ALTER TABLE `CartItem`
  ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ChatMessage`
--
ALTER TABLE `ChatMessage`
  ADD CONSTRAINT `ChatMessage_chatId_fkey` FOREIGN KEY (`chatId`) REFERENCES `Chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Media`
--
ALTER TABLE `Media`
  ADD CONSTRAINT `Media_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `OrderItem`
--
ALTER TABLE `OrderItem`
  ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `Variant` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Review`
--
ALTER TABLE `Review`
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Variant`
--
ALTER TABLE `Variant`
  ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
