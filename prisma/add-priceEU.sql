-- Adauga coloana priceEU la tabela Variant
ALTER TABLE Variant ADD COLUMN priceEU DOUBLE NULL;

-- Actualizeaza preturile EU (pret RO + 20%%)
UPDATE Variant SET priceEU = ROUND(price * 1.20, 2);
