-- Örnek tedarikçiler
INSERT INTO vendors (name, tax_no, phone, email, iban, currency) VALUES
('Mehmet İnşaat Ltd. Şti.', '1234567890', '0532 123 45 67', 'info@mehmetinsaat.com', 'TR33 0006 1005 1978 6457 8413 26', 'TRY'),
('Akçansa Çimento San. ve Tic. A.Ş.', '9876543210', '0212 456 78 90', 'satis@akcansa.com.tr', 'TR64 0001 2009 4520 0058 0015 02', 'TRY'),
('Bosch Elektrik Malzemeleri', '5555666677', '0216 789 01 23', 'bosch@elektrik.com', 'TR98 0004 6007 8800 0000 6789 01', 'TRY'),
('Güven Elektrik Tesisatı', '3333444455', '0533 987 65 43', 'guven@elektrik.net', 'TR12 0010 3000 0000 0018 4567 89', 'TRY'),
('Demir Çelik A.Ş.', '7777888899', '0212 345 67 89', 'satis@demircelik.com', 'TR45 0006 2000 1230 0006 2987 65', 'TRY');

-- Tedarikçi bakiyelerini başlat
INSERT INTO vendor_balances (vendor_id, total_invoiced, total_paid, remaining_balance) 
SELECT id, 0, 0, 0 FROM vendors;

-- Örnek faturalar
INSERT INTO purchase_invoices (vendor_id, invoice_no, invoice_date, due_date, total_amount, description, accounting_code) VALUES
(1, 'FAT-2024-001', '2024-01-15', '2024-02-15', 150000.00, 'Betonarme işleri - 1. hakediş', '320'),
(2, 'AKC-2024-001', '2024-01-20', '2024-02-20', 250000.00, 'Çimento ve kum alımı', '320'),
(3, 'BSH-2024-001', '2024-01-25', '2024-02-25', 85000.00, 'Elektrik malzemeleri', '320'),
(4, 'GVN-2024-001', '2024-02-01', '2024-03-01', 45000.00, 'Elektrik tesisatı kurulumu', '320'),
(5, 'DMR-2024-001', '2024-02-05', '2024-03-05', 120000.00, 'Demir çelik malzeme', '320');

-- Tedarikçi bakiyelerini güncelle
UPDATE vendor_balances vb 
SET total_invoiced = (
    SELECT COALESCE(SUM(total_amount), 0) 
    FROM purchase_invoices pi 
    WHERE pi.vendor_id = vb.vendor_id
),
remaining_balance = (
    SELECT COALESCE(SUM(total_amount), 0) 
    FROM purchase_invoices pi 
    WHERE pi.vendor_id = vb.vendor_id
);

-- Örnek ödeme planları
INSERT INTO payment_plans (invoice_id, due_date, planned_amount, status) VALUES
(1, '2024-02-15', 75000.00, 'Bekliyor'),
(1, '2024-03-15', 75000.00, 'Bekliyor'),
(2, '2024-02-20', 125000.00, 'Bekliyor'),
(2, '2024-03-20', 125000.00, 'Bekliyor'),
(3, '2024-02-25', 85000.00, 'Bekliyor'),
(4, '2024-03-01', 45000.00, 'Bekliyor'),
(5, '2024-03-05', 60000.00, 'Bekliyor'),
(5, '2024-04-05', 60000.00, 'Bekliyor');

-- Örnek ödemeler
INSERT INTO payments (vendor_id, payment_date, amount, payment_method, invoice_id, reference_no, accounting_code, description) VALUES
(1, '2024-01-24', 75000.00, 'Banka', 1, 'HVL-2024-001', '320', 'Mehmet İnşaat - İlk taksit ödemesi'),
(2, '2024-01-30', 125000.00, 'EFT', 2, 'EFT-2024-001', '320', 'Akçansa - Çimento ödemesi'),
(3, '2024-02-10', 42500.00, 'Çek', 3, 'ÇEK-001', '320', 'Bosch - Kısmi ödeme'),
(4, '2024-02-15', 45000.00, 'Banka', 4, 'HVL-2024-002', '320', 'Güven Elektrik - Tam ödeme');

-- Ödeme sonrası bakiyeleri güncelle
UPDATE vendor_balances vb 
SET total_paid = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM payments p 
    WHERE p.vendor_id = vb.vendor_id
),
remaining_balance = (
    SELECT COALESCE(SUM(pi.total_amount), 0) - COALESCE(SUM(p.amount), 0)
    FROM purchase_invoices pi 
    LEFT JOIN payments p ON p.vendor_id = pi.vendor_id
    WHERE pi.vendor_id = vb.vendor_id
    GROUP BY pi.vendor_id
);

-- Ödenen fatura durumlarını güncelle
UPDATE purchase_invoices pi 
SET is_paid = (
    CASE WHEN (
        SELECT COALESCE(SUM(p.amount), 0) 
        FROM payments p 
        WHERE p.invoice_id = pi.id
    ) >= pi.total_amount THEN TRUE ELSE FALSE END
);

-- Ödenen ödeme planlarını güncelle
UPDATE payment_plans pp 
SET status = 'Ödendi' 
WHERE id IN (
    SELECT DISTINCT p.payment_plan_id 
    FROM payments p 
    WHERE p.payment_plan_id IS NOT NULL
);

-- Gecikmiş ödeme planlarını işaretle
UPDATE payment_plans 
SET status = 'Gecikmiş' 
WHERE due_date < CURDATE() AND status = 'Bekliyor';
