CREATE DATABASE book_trader;
USE book_trader;

CREATE TABLE users (
  user_id integer PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(50) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW()
  -- own_books
  -- sell_transactions
  -- buy_transactions
);

CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  date_created TIMESTAMP NOT NULL DEFAULT NOW(),
  date_for_sale TIMESTAMP,
  for_sale BOOLEAN NOT NULL DEFAULT 0,
  owned_by INT NOT NULL,
  ol_id VARCHAR(13),
  price DECIMAL (8,2) NOT NULL DEFAULT 0,
  book_condition ENUM('New', 'Like-new', 'Very good', 'Good', 'Fair', 'Poor') NOT NULL DEFAULT 'Good',
  FOREIGN KEY (owned_by) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  created_date TIMESTAMP NOT NULL DEFAULT NOW(),
  buyer_id INT NOT NULL,
  seller_id INT NOT NULL,
  seller_approval BOOLEAN DEFAULT 0,
  buyer_approval BOOLEAN DEFAULT 0,
  book_id INT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books (book_id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE SET NULL,
  FOREIGN KEY (buyer_id) REFERENCES users (user_id) ON DELETE SET NULL
);