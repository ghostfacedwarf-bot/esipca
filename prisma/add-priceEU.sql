-- Adauga coloana priceEU la tabela Variant
ALTER TABLE Variant ADD COLUMN priceEU DOUBLE NULL;

-- Actualizeaza preturile EU (pret RO x 2 = dublu)
UPDATE Variant SET priceEU = ROUND(price * 2, 2);
