INSERT INTO page_sections (section_key, content) VALUES
  (
    'featured_showcase',
    '{"eyebrow":"Öne Çıkan","title":"Mont Blanc","subtitle":"Premium kırtasiye koleksiyonu"}'::jsonb
  )
ON CONFLICT (section_key) DO NOTHING;
