import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/authService';
import { getApiErrorMessage } from '../../utils/apiError';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: '' });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.username.trim()) nextErrors.username = 'Username is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setIsSubmitting(true);
    try {
      await authService.register({ username: form.username.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created. You can now sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create an account" subtitle="Your seat is waiting.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field"><span>Username</span><div className="input-wrap"><UserRound size={17} /><input name="username" value={form.username} onChange={updateField} autoComplete="username" placeholder="Choose a username" /></div>{errors.username && <small className="field-error">{errors.username}</small>}</label>
        <label className="field"><span>Email</span><div className="input-wrap"><Mail size={17} /><input name="email" type="email" value={form.email} onChange={updateField} autoComplete="email" placeholder="you@example.com" /></div>{errors.email && <small className="field-error">{errors.email}</small>}</label>
        <label className="field"><span>Password</span><div className="input-wrap"><LockKeyhole size={17} /><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} autoComplete="new-password" placeholder="At least 8 characters" /><button className="icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <small className="field-error">{errors.password}</small>}</label>
        <label className="field"><span>Confirm password</span><div className="input-wrap"><LockKeyhole size={17} /><input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={updateField} autoComplete="new-password" placeholder="Repeat your password" /></div>{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</label>
        <button className="button button-primary button-wide" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}
