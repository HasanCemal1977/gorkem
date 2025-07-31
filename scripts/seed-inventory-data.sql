-- Ürün kategorileri
INSERT INTO product_categories (name, description) VALUES
('İnşaat Malzemeleri', 'Çimento, demir, tuğla vb.'),
('Elektrik Malzemeleri', 'Kablo, anahtar, priz vb.'),
('Seramik & Fayans', 'Zemin ve duvar kaplamaları'),
('Banyo Gereçleri', 'Klozet, lavabo, batarya vb.'),
('Boya & Kimyasallar', 'İç-dış cephe boyaları'),
('Yalıtım Malzemeleri', 'Isı ve su yalıtımı'),
('Kapı & Pencere', 'Ahşap ve PVC doğramalar');

-- Depolar
INSERT INTO warehouses (name, location, manager_name, phone) VALUES
('Ana Depo', 'İstanbul Pendik Organize Sanayi Bölgesi', 'Ahmet Yılmaz', '0532 123 4567'),
('Şantiye Deposu A', 'Konut Projesi A - Bahçelievler', 'Mehmet Demir', '0533 234 5678'),
('Şantiye Deposu B', 'Konut Projesi B - Beylikdüzü', 'Ali Kaya', '0534 345 6789'),
('Merkez Depo', 'İstanbul Ümraniye', 'Fatma Özkan', '0535 456 7890');

-- Ürünler
INSERT INTO products (product_code, barcode, name, description, category_id, unit, purchase_price, sales_price, critical_stock) VALUES
('MAL-001', '8690123456789', 'Çimento Portland CEM I 42.5', 'Yüksek dayanımlı çimento', 1, 'Ton', 850.00, 950.00, 20),
('MAL-002', '8690123456790', 'Demir 12mm Nervürlü', 'İnşaat demiri 12mm', 1, 'Ton', 18500.00, 19500.00, 15),
('MAL-003', '8690123456791', 'Tuğla Delikli 19cm', 'Standart yapı tuğlası', 1, 'Adet', 2.50, 3.00, 1000),
('ELK-001', '8690123456792', 'Kablo NYA 2.5mm', 'Tek damarlı bakır kablo', 2, 'Metre', 12.00, 15.00, 1000),
('ELK-002', '8690123456793', 'Anahtar Tekli Beyaz', 'Standart anahtar', 2, 'Adet', 25.00, 35.00, 100),
('SER-001', '8690123456794', 'Seramik 60x60 Beyaz', 'Mat beyaz seramik', 3, 'm²', 85.00, 120.00, 100),
('BAN-001', '8690123456795', 'Klozet Takımı Beyaz', 'Rezervuarlı klozet', 4, 'Adet', 1200.00, 1500.00, 10),
('BOY-001', '8690123456796', 'İç Cephe Boyası Beyaz', 'Su bazlı iç cephe boyası', 5, 'Litre', 45.00, 65.00, 50);

-- Stok seviyeleri (her ürün için her depoda)
INSERT INTO stock_levels (product_id, warehouse_id, quantity) VALUES
-- Ana Depo
(1, 1, 45), (2, 1, 8), (3, 1, 5000), (4, 1, 2500), (5, 1, 200), (6, 1, 150), (7, 1, 5), (8, 1, 200),
-- Şantiye Deposu A
(1, 2, 20), (2, 2, 5), (3, 2, 2000), (4, 2, 500), (5, 2, 50), (6, 2, 80), (7, 2, 2), (8, 2, 50),
-- Şantiye Deposu B
(1, 3, 15), (2, 3, 3), (3, 3, 1500), (4, 3, 300), (5, 3, 30), (6, 3, 60), (7, 3, 1), (8, 3, 30),
-- Merkez Depo
(1, 4, 30), (2, 4, 10), (3, 4, 3000), (4, 4, 1000), (5, 4, 100), (6, 4, 100), (7, 4, 3), (8, 4, 100);

-- Satın alma siparişleri
INSERT INTO purchase_orders (order_number, vendor_id, order_date, expected_delivery_date, status, total_amount, description, created_by) VALUES
('PO-2024-001', 1, '2024-01-25', '2024-02-05', 'Onaylandı', 85000.00, 'Çimento siparişi', 'Ahmet Yılmaz'),
('PO-2024-002', 2, '2024-01-26', '2024-02-10', 'Bekliyor', 370000.00, 'Demir siparişi', 'Mehmet Demir'),
('PO-2024-003', 3, '2024-01-27', '2024-02-01', 'Tamamlandı', 60000.00, 'Elektrik malzemesi', 'Ali Kaya');

-- Satın alma sipariş kalemleri
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity, unit_price, total_price, warehouse_id) VALUES
(1, 1, 100, 850.00, 85000.00, 1),
(2, 2, 20, 18500.00, 370000.00, 1),
(3, 4, 5000, 12.00, 60000.00, 1);

-- Satış siparişleri
INSERT INTO sales_orders (order_number, customer_name, customer_phone, order_date, delivery_date, status, total_amount, created_by) VALUES
('SO-2024-001', 'ABC İnşaat Ltd.', '0212 123 4567', '2024-01-28', '2024-02-15', 'Onaylandı', 47500.00, 'Fatma Özkan'),
('SO-2024-002', 'XYZ Yapı A.Ş.', '0216 234 5678', '2024-01-29', '2024-02-20', 'Hazırlanıyor', 195000.00, 'Ahmet Yılmaz');

-- Satış sipariş kalemleri
INSERT INTO sales_order_items (sales_order_id, product_id, quantity, unit_price, total_price, warehouse_id) VALUES
(1, 1, 50, 950.00, 47500.00, 1),
(2, 2, 10, 19500.00, 195000.00, 1);

-- Stok hareketleri
INSERT INTO stock_movements (product_id, warehouse_id, movement_type, reference_type, quantity, movement_date, description, user_name) VALUES
(1, 1, 'Giriş', 'Satın Alma', 100, '2024-01-25', 'PO-2024-001 teslimatı', 'Ahmet Yılmaz'),
(1, 1, 'Çıkış', 'Satış', 50, '2024-01-28', 'SO-2024-001 sevkiyatı', 'Fatma Özkan'),
(4, 1, 'Giriş', 'Satın Alma', 5000, '2024-01-27', 'PO-2024-003 teslimatı', 'Ali Kaya'),
(2, 1, 'Çıkış', 'Transfer', 5, '2024-01-29', 'Şantiye A\'ya transfer', 'Mehmet Demir'),
(2, 2, 'Giriş', 'Transfer', 5, '2024-01-29', 'Ana depodan transfer', 'Mehmet Demir');
