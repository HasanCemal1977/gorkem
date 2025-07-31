-- Insert sample banking accounts
INSERT INTO banking_accounts (account_name, account_number, bank_name, branch, account_type, balance, currency, iban, swift_code, status) VALUES
('Ana İşletme Hesabı', '1234567890', 'Türkiye İş Bankası', 'Merkez Şubesi', 'business', 250000.00, 'TRY', 'TR330006400000011234567890', 'ISBKTRIS', 'active'),
('Yedek Hesap', '0987654321', 'Garanti BBVA', 'Kadıköy Şubesi', 'savings', 75000.00, 'TRY', 'TR640062000000000987654321', 'TGBATRIS', 'active'),
('Proje Hesabı', '1122334455', 'Yapı Kredi Bankası', 'Beşiktaş Şubesi', 'checking', 125000.00, 'TRY', 'TR210067400000001122334455', 'YAPITRIS', 'active'),
('Döviz Hesabı', '5566778899', 'Akbank', 'Levent Şubesi', 'business', 15000.00, 'USD', 'TR120046400000005566778899', 'AKBKTRIS', 'active');

-- Insert sample banking transactions
INSERT INTO banking_transactions (account_id, transaction_type, amount, description, transaction_date, reference_number, category, status) VALUES
(1, 'income', 50000.00, 'Proje ödemesi - Villa projesi', '2024-01-15', 'REF001', 'Proje Geliri', 'completed'),
(1, 'expense', 15000.00, 'Malzeme alımı - çimento', '2024-01-16', 'REF002', 'Malzeme', 'completed'),
(2, 'income', 25000.00, 'Müşteri ödemesi', '2024-01-17', 'REF003', 'Müşteri Ödemesi', 'completed'),
(1, 'expense', 8000.00, 'İşçi maaşları', '2024-01-18', 'REF004', 'Personel', 'completed'),
(3, 'income', 75000.00, 'Yeni proje avansı', '2024-01-19', 'REF005', 'Avans', 'completed'),
(1, 'expense', 12000.00, 'Araç yakıtı ve bakım', '2024-01-20', 'REF006', 'Araç Giderleri', 'completed');

-- Insert sample banking loans
INSERT INTO banking_loans (account_id, loan_type, principal_amount, interest_rate, term_months, start_date, monthly_payment, remaining_balance, status, description) VALUES
(1, 'business', 500000.00, 15.50, 60, '2023-06-01', 12500.00, 425000.00, 'active', 'İş yeri genişletme kredisi'),
(2, 'vehicle', 150000.00, 12.75, 48, '2023-09-01', 3800.00, 135000.00, 'active', 'İş makinesi kredisi'),
(3, 'business', 200000.00, 14.25, 36, '2024-01-01', 6200.00, 200000.00, 'active', 'Proje finansman kredisi');

-- Insert sample banking checks
INSERT INTO banking_checks (account_id, check_type, check_number, amount, issue_date, due_date, payee, drawer, status, description) VALUES
(1, 'issued', 'CHK001', 25000.00, '2024-01-10', '2024-02-10', 'ABC İnşaat Malzemeleri', 'Şirketimiz', 'pending', 'Malzeme ödemesi'),
(2, 'received', 'CHK002', 40000.00, '2024-01-12', '2024-02-12', 'Şirketimiz', 'XYZ Müteahhitlik', 'cleared', 'Proje ödemesi'),
(1, 'issued', 'CHK003', 15000.00, '2024-01-15', '2024-03-15', 'DEF Nakliyat', 'Şirketimiz', 'pending', 'Nakliye ödemesi'),
(3, 'received', 'CHK004', 60000.00, '2024-01-18', '2024-02-18', 'Şirketimiz', 'GHI Gayrimenkul', 'pending', 'Müşteri ödemesi');

-- Insert sample banking receipts
INSERT INTO banking_receipts (account_id, receipt_type, receipt_number, amount, receipt_date, payer, description, status) VALUES
(1, 'transfer', 'RCP001', 35000.00, '2024-01-14', 'Ahmet Yılmaz', 'Villa projesi ara ödemesi', 'received'),
(2, 'cash', 'RCP002', 8000.00, '2024-01-16', 'Mehmet Kaya', 'Tadilat işi ödemesi', 'received'),
(1, 'check', 'RCP003', 22000.00, '2024-01-18', 'Fatma Demir', 'Daire projesi avansı', 'received'),
(3, 'transfer', 'RCP004', 45000.00, '2024-01-20', 'Ali Özkan', 'Ofis projesi ödemesi', 'received'),
(1, 'card', 'RCP005', 12000.00, '2024-01-22', 'Ayşe Çelik', 'Küçük tadilat işi', 'received');
