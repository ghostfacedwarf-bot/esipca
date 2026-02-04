-- =====================================================
-- Script pentru adăugarea coloanei discountPercent
-- Rulează în phpMyAdmin pe Hostinger
-- IMPORTANT: Rulează FIECARE comandă SEPARAT!
-- =====================================================

-- PASUL 1: Verifică dacă coloana există deja
-- Copiază și rulează această linie singură:
SHOW COLUMNS FROM Product LIKE 'discountPercent';

-- PASUL 2: Dacă coloana NU există (rezultat gol la pasul 1), rulează:
ALTER TABLE Product ADD COLUMN discountPercent DOUBLE DEFAULT 0 AFTER priceFrom;

-- PASUL 3: Setează discount 0 pentru toate produsele existente
UPDATE Product SET discountPercent = 0 WHERE discountPercent IS NULL;

-- PASUL 4: Verifică că s-a adăugat coloana corect
SELECT id, name, priceFrom, discountPercent FROM Product LIMIT 5;

-- =====================================================
-- GATA! Acum poți face redeploy pe Hostinger
-- =====================================================
