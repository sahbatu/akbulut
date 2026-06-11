-- Authenticated kullanıcılar is_admin() RPC çağırabilsin
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin() TO anon;
