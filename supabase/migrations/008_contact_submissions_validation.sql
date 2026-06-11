-- İletişim formu: sunucu tarafı doğrulama (anon API bypass önlemi)

ALTER TABLE contact_submissions
  ADD CONSTRAINT contact_phone_digits CHECK (phone ~ '^\d{10,11}$'),
  ADD CONSTRAINT contact_email_format CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  ADD CONSTRAINT contact_name_length CHECK (char_length(name) BETWEEN 2 AND 120),
  ADD CONSTRAINT contact_company_length CHECK (char_length(company) BETWEEN 2 AND 200),
  ADD CONSTRAINT contact_subject_length CHECK (char_length(subject) BETWEEN 3 AND 200),
  ADD CONSTRAINT contact_message_length CHECK (char_length(message) BETWEEN 10 AND 5000);
