-- Temel roller
INSERT INTO roles (name, description) VALUES
('Admin', 'Sistem yöneticisi - Tüm yetkilere sahip'),
('Muhasebe', 'Muhasebe işlemleri yetkisi'),
('Finans', 'Finansal işlemler yetkisi'),
('Stok', 'Stok ve envanter yönetimi yetkisi'),
('Proje', 'Proje yönetimi yetkisi'),
('Okuyucu', 'Sadece görüntüleme yetkisi');

-- Temel yetkiler
INSERT INTO permissions (name, description, module) VALUES
-- Genel yetkiler
('dashboard_view', 'Ana sayfa görüntüleme', 'dashboard'),
('reports_view', 'Raporları görüntüleme', 'reports'),

-- Stok yetkileri
('inventory_view', 'Stok görüntüleme', 'inventory'),
('inventory_create', 'Stok ekleme', 'inventory'),
('inventory_edit', 'Stok düzenleme', 'inventory'),
('inventory_delete', 'Stok silme', 'inventory'),
('stock_movement', 'Stok hareketi yapma', 'inventory'),

-- Muhasebe yetkileri
('accounting_view', 'Muhasebe görüntüleme', 'accounting'),
('accounting_create', 'Muhasebe kaydı ekleme', 'accounting'),
('accounting_edit', 'Muhasebe düzenleme', 'accounting'),
('accounting_delete', 'Muhasebe silme', 'accounting'),

-- Finans yetkileri
('banking_view', 'Bankacılık görüntüleme', 'banking'),
('banking_create', 'Bankacılık işlemi ekleme', 'banking'),
('banking_edit', 'Bankacılık düzenleme', 'banking'),
('banking_delete', 'Bankacılık silme', 'banking'),
('payment_view', 'Ödeme görüntüleme', 'payments'),
('payment_create', 'Ödeme ekleme', 'payments'),
('payment_edit', 'Ödeme düzenleme', 'payments'),
('payment_delete', 'Ödeme silme', 'payments'),

-- Proje yetkileri
('project_view', 'Proje görüntüleme', 'projects'),
('project_create', 'Proje ekleme', 'projects'),
('project_edit', 'Proje düzenleme', 'projects'),
('project_delete', 'Proje silme', 'projects'),

-- Satın alma yetkileri
('procurement_view', 'Satın alma görüntüleme', 'procurement'),
('procurement_create', 'Satın alma ekleme', 'procurement'),
('procurement_edit', 'Satın alma düzenleme', 'procurement'),
('procurement_delete', 'Satın alma silme', 'procurement'),

-- Kullanıcı yönetimi
('user_management', 'Kullanıcı yönetimi', 'admin'),
('role_management', 'Rol yönetimi', 'admin'),
('system_settings', 'Sistem ayarları', 'admin');

-- Admin rolüne tüm yetkileri ver
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Muhasebe rolü yetkileri
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE module IN ('dashboard', 'accounting', 'reports') OR name LIKE '%_view';

-- Finans rolü yetkileri
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE module IN ('dashboard', 'banking', 'payments', 'reports') OR name LIKE '%_view';

-- Stok rolü yetkileri
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE module IN ('dashboard', 'inventory', 'procurement', 'reports') OR name LIKE '%_view';

-- Proje rolü yetkileri
INSERT INTO role_permissions (role_id, permission_id)
SELECT 5, id FROM permissions 
WHERE module IN ('dashboard', 'projects', 'reports') OR name LIKE '%_view';

-- Okuyucu rolü yetkileri (sadece görüntüleme)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 6, id FROM permissions 
WHERE name LIKE '%_view';

-- Test kullanıcıları (şifre: 123456)
INSERT INTO users (username, email, password_hash, full_name, department, status) VALUES
('admin', 'admin@company.com', '$2b$10$rQZ8kHWiZ8qhExQ7XjRgUeKvY8fY9qY8fY9qY8fY9qY8fY9qY8fY9q', 'Sistem Yöneticisi', 'BT', 'Aktif'),
('muhasebe', 'muhasebe@company.com', '$2b$10$rQZ8kHWiZ8qhExQ7XjRgUeKvY8fY9qY8fY9qY8fY9qY8fY9qY8fY9q', 'Muhasebe Uzmanı', 'Muhasebe', 'Aktif'),
('finans', 'finans@company.com', '$2b$10$rQZ8kHWiZ8qhExQ7XjRgUeKvY8fY9qY8fY9qY8fY9qY8fY9qY8fY9q', 'Finans Uzmanı', 'Finans', 'Aktif'),
('stok', 'stok@company.com', '$2b$10$rQZ8kHWiZ8qhExQ7XjRgUeKvY8fY9qY8fY9qY8fY9qY8fY9qY8fY9q', 'Stok Uzmanı', 'Lojistik', 'Aktif');

-- Kullanıcılara roller ata
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- admin -> Admin
(2, 2), -- muhasebe -> Muhasebe
(3, 3), -- finans -> Finans
(4, 4); -- stok -> Stok
