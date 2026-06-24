import Logo from '@/assets/logo.svg?react';
import LoginICon from '@/assets/pablo-sign-in.svg?react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './LoginPage.module.scss';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    // Simulate network
    await new Promise(r => setTimeout(r, 800));
    login(data);
    setLoading(false);
    navigate({ to: '/users' });
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.logoArea}>
          <Logo />
        </div>
        <div className={styles.illustration}>
          <LoginICon />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.form}>
          <h1 className={styles.heading}>Welcome!</h1>
          <p className={styles.sub}>Enter details to login.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={styles.field}>
              <input
                type="email"
                placeholder="Email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' },
                })}
              />
              {errors.email && <span className={styles.error}>{String(errors.email.message)}</span>}
            </div>

            <div className={styles.field}>
              <div className={`${styles.passwordWrap} ${errors.password ? styles.inputError : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={styles.passwordInput}
                  {...register('password', { required: 'Password is required' })}
                />
                <button type="button" className={styles.showBtn} onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              {errors.password && <span className={styles.error}>{String(errors.password.message)}</span>}
            </div>

            <a href="#" className={styles.forgot}>FORGOT PASSWORD?</a>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in…' : 'LOG IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
