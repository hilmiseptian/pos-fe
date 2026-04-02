import { useEffectOnce } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../api';
import { alertError, alertSuccess } from '@/shared/utils/alert';
import { useAuth } from '@/modules/auth/context';

export default function UserLogout() {
  const { token, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await userLogout(token);
      setToken('');
      setUser('');
      await alertSuccess('Logged out successfully');
      navigate('/');
    } catch (err) {
      navigate('/');
      // await alertError(err.response?.data?.message || err.message);
    }
  }

  useEffectOnce(() => {
    handleLogout();
  });

  return null;
}
