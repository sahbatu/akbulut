-- Slayt ve logo yüklemeleri için brand bucket limitini 5 MB yap
UPDATE storage.buckets
SET file_size_limit = 5242880
WHERE id = 'brand';
