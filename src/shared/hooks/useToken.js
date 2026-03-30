import { useLocalStorage } from 'react-use';

export function useToken() {
  return useLocalStorage('token', '');
}