-- Tedarikçiler tablosu
CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    tax_no VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(100),
    address TEXT,
    iban VARCHAR(34),
    currency VARCHAR(10) DEFAULT 'TRY',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Satın alma faturaları tablosu
CREATE TABLE IF NOT EXISTS purchase_invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    invoice_no VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'TRY',
    description TEXT,
    accounting_code VARCHAR(20) DEFAULT '320',
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Ödeme planları tablosu
CREATE TABLE IF NOT EXISTS payment_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    due_date DATE NOT NULL,
    planned_amount DECIMAL(15,2) NOT NULL,
    status ENUM('Bekliyor', 'Ödendi', 'Gecikmiş') DEFAULT 'Bekliyor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES purchase_invoices(id) ON DELETE CASCADE
);

-- Ödemeler tablosu
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('Nakit', 'Banka', 'Çek', 'Senet') NOT NULL,
    bank_account_id INT NULL,
    invoice_id INT NULL,
    payment_plan_id INT NULL,
    reference_no VARCHAR(100),
    accounting_code VARCHAR(20) DEFAULT '320',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (invoice_id) REFERENCES purchase_invoices(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id) ON DELETE SET NULL
);

-- Tedarikçi bakiyeleri tablosu
CREATE TABLE IF NOT EXISTS vendor_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT NOT NULL UNIQUE,
    total_invoiced DECIMAL(15,2) DEFAULT 0,
    total_paid DECIMAL(15,2) DEFAULT 0,
    remaining_balance DECIMAL(15,2) DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- Şirketler tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tax_no VARCHAR(50),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan şirket kaydı
INSERT IGNORE INTO companies (id, name) VALUES (1, 'Ana Şirket');

-- İndeksler
CREATE INDEX idx_vendors_name ON vendors(name);
CREATE INDEX idx_purchase_invoices_vendor ON purchase_invoices(vendor_id);
CREATE INDEX idx_purchase_invoices_date ON purchase_invoices(invoice_date);
CREATE INDEX idx_purchase_invoices_due ON purchase_invoices(due_date);
CREATE INDEX idx_payments_vendor ON payments(vendor_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payment_plans_invoice ON payment_plans(invoice_id);
CREATE INDEX idx_payment_plans_due ON payment_plans(due_date);
