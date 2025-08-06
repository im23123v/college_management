
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function DeveloperIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/developer/dashboard');
  }, []);

  return null;
}
