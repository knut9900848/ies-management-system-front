interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  two_factor_confirmed_at: null;
  two_factor_recovery_codes: null;
  created_at: string;
  updated_at: string;
  password?: string;
}

export default User;
