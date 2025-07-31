-- Banking Accounts Table
CREATE TABLE IF NOT EXISTS banking_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  branch VARCHAR(255),
  account_type ENUM('checking', 'savings', 'business', 'investment') DEFAULT 'checking',
  balance DECIMAL(15,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'TRY',
  iban VARCHAR(34),
  swift_code VARCHAR(11),
  status ENUM('active', 'inactive', 'closed') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_account_number (account_number),
  INDEX idx_bank_name (bank_name),
  INDEX idx_status (status)
);

-- Banking Transactions Table
CREATE TABLE IF NOT EXISTS banking_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  transaction_type ENUM('income', 'expense', 'transfer') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  reference_number VARCHAR(100),
  category VARCHAR(100),
  project_id INT,
  status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES banking_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_account_id (account_id),
  INDEX idx_transaction_date (transaction_date),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_status (status)
);

-- Banking Loans Table
CREATE TABLE IF NOT EXISTS banking_loans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  loan_type ENUM('personal', 'business', 'mortgage', 'vehicle', 'other') NOT NULL,
  principal_amount DECIMAL(15,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  term_months INT NOT NULL,
  start_date DATE NOT NULL,
  monthly_payment DECIMAL(15,2) NOT NULL,
  remaining_balance DECIMAL(15,2) NOT NULL,
  status ENUM('active', 'paid_off', 'defaulted', 'restructured') DEFAULT 'active',
  description TEXT,
  guarantor VARCHAR(255),
  collateral TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES banking_accounts(id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id),
  INDEX idx_loan_type (loan_type),
  INDEX idx_status (status),
  INDEX idx_start_date (start_date)
);

-- Banking Checks Table
CREATE TABLE IF NOT EXISTS banking_checks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  check_type ENUM('issued', 'received') NOT NULL,
  check_number VARCHAR(50) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  payee VARCHAR(255),
  drawer VARCHAR(255),
  status ENUM('pending', 'cleared', 'bounced', 'cancelled') DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES banking_accounts(id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id),
  INDEX idx_check_number (check_number),
  INDEX idx_due_date (due_date),
  INDEX idx_status (status),
  INDEX idx_check_type (check_type)
);

-- Banking Receipts Table
CREATE TABLE IF NOT EXISTS banking_receipts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  receipt_type ENUM('cash', 'check', 'transfer', 'card') NOT NULL,
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  receipt_date DATE NOT NULL,
  payer VARCHAR(255) NOT NULL,
  description TEXT,
  project_id INT,
  status ENUM('received', 'pending', 'cancelled') DEFAULT 'received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES banking_accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_account_id (account_id),
  INDEX idx_receipt_number (receipt_number),
  INDEX idx_receipt_date (receipt_date),
  INDEX idx_status (status)
);
