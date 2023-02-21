import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import Router from 'next/router';
import { useUser } from './../hooks/useUser';

type FormData = {
  username: string;
  password: string;
};

const schema = yup
  .object({
    username: yup.string().min(3).required(),
    password: yup.string().min(4).required()
  })
  .required();

export default function LogIn() {
  const user = useUser({ redirectIfFound: true, redirectTo: '/' });
  const { mutateAsync } = useMutation({
    mutationKey: ['auth/login'],
    mutationFn: async (data: FormData) => {
      const res = await fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await res.json();
      window.localStorage.setItem('token', json.token);
      Router.push('/');
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const onSubmit = handleSubmit(async data => {
    await mutateAsync(data);
  });

  useEffect(() => {
    if (isValid) return;
  }, [errors, isValid]);

  return (
    <div className="w-[50%] mx-auto mt-32">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
        <input {...register('username')} placeholder="Username" />
        <input {...register('password')} placeholder="Password" />
        <button
          className="bg-stone-500 hover:bg-blue-500 w-auto transition-all py-2"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
