CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at DATE NOT NULL,
  updated_at DATE DEFAULT NOW(),
  recipient TEXT NOT NULL,
  amount INT NOT NULL
);

CREATE INDEX transactions_created_at_idx ON transactions(created_at);
CREATE INDEX transactions_updated_at_idx ON transactions(updated_at);
CREATE INDEX transactions_recipient_idx ON transactions(recipient);

INSERT INTO transactions (created_at, recipient, amount)
VALUES
('2026-09-01', 'ICA', -350),
('2026-09-02', 'SL', -120),
('2026-09-04', 'Employer', 30000),
('2026-09-06', 'Lidl', -450),
('2026-09-10', 'Max', -200),
('2026-09-11', 'Cinema', -179);

CREATE TABLE classifications (
  recipient TEXT PRIMARY KEY,
  classification TEXT NOT NULL
    Check (classification IN ('Household', 'Transport', 'Food', 'Entertainment'))
);

CREATE UNIQUE INDEX classification_recipient_lower_idx ON classifications(LOWER(recipient));

INSERT INTO classifications (recipient, classification)
VALUES
('IKEA', 'Household'),
('Mio', 'Household'),
('Jysk', 'Household'),
('Loans', 'Household'),
('Rent', 'Household'),
('Insurance', 'Household'),
('SL', 'Transport'),
('SJ', 'Transport'),
('Västtrafik', 'Transport'),
('Skånetrafiken', 'Transport'),
('UL', 'Transport'),
('Östgötatrafiken', 'Transport'),
('Hallandstrafiken', 'Transport'),
('Länstrafiken Örebro', 'Transport'),
('Dalatrafik', 'Transport'),
('X-trafik', 'Transport'),
('Länstrafiken Västerbotten', 'Transport'),
('Länstrafiken Norrbotten', 'Transport'),
('Tabussen', 'Transport'),
('ICA', 'Food'),
('Coop', 'Food'),
('Willys', 'Food'),
('Lidl', 'Food'),
('Hemköp', 'Food'),
('Handlarn', 'Food'),
('Netflix', 'Entertainment'),
('Disney Plus', 'Entertainment'),
('Prime', 'Entertainment'),
('Apple Tv', 'Entertainment'),
('Spotify', 'Entertainment'),
('Apple Music', 'Entertainment'),
('Tidal', 'Entertainment');