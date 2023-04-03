import { useQuery } from '@tanstack/react-query';
import Router from 'next/router';
import { useEffect } from 'react';

export function useUser({
  redirectTo,
  redirectIfFound
}: { redirectTo?: string; redirectIfFound?: boolean } = {}) {
  const { data, error, isFetched } = useQuery(
    ['auth/user'],
    async () => {
      const token = window?.localStorage.getItem('token');
      console.log('token', token);

      if (!token) throw new Error('Invalid Token');

      const res = await fetch('http://127.0.0.1:8000/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`
        }
      });

      const json = await res.json();

      return json as {
        id: string;
        username: string;
        last_name: string;
        first_name: string;
        details: {
          gender: string;
          date_of_birth: string;
        };
      };
    },
    {
      // cacheTime: 0,
      // staleTime: Infinity
    }
  );
  const hasUser = Boolean(data);

  useEffect(() => {
    if (!redirectTo || !isFetched) return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !hasUser) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, isFetched, hasUser]);

  return error ? null : data;
}
