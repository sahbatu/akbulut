CREATE POLICY "Admin delete contact_submissions" ON contact_submissions
  FOR DELETE USING (is_admin());
