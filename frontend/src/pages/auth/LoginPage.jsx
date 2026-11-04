import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getApiErrorMessage } from '../../utils/apiError';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
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
    if (!form.password) nextErrors.password = 'Password is required.';
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setIsSubmitting(true);
    try {
      const { data } = await authService.login(form);
      signIn(data);
      toast.success(`Welcome back, ${data.username}.`);
      const destination = data.roles?.includes('ROLE_ADMIN') ? '/admin/dashboard' : (location.state?.from?.pathname || '/');
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Sign in failed. Please check your details.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Pick up where you left off.">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label className="field"><span>Username</span><div className="input-wrap"><UserRound size={17} /><input name="username" value={form.username} onChange={updateField} autoComplete="username" placeholder="Your username" /></div>{errors.username && <small className="field-error">{errors.username}</small>}</label>
        <label className="field"><span>Password</span><div className="input-wrap"><LockKeyhole size={17} /><input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={updateField} autoComplete="current-password" placeholder="Your password" /><button className="icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{errors.password && <small className="field-error">{errors.password}</small>}</label>
        <button className="button button-primary button-wide" disabled={isSubmitting} type="submit">{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">New to ReelReserve? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}
