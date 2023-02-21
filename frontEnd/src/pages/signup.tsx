import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../hooks/useUser';
import Router from 'next/router';

type FormData = {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  username: string;
  password: string;
  passwordAgain: string;
};

const schema = yup
  .object({
    first_name: yup.string().min(3).required(),
    last_name: yup.string().min(3).required(),
    date_of_birth: yup.string().required(),
    gender: yup
      .string()
      .matches(/^(M|F)$/)
      .required(),
    username: yup.string().min(3).required(),
    password: yup.string().min(4).required(),
    passwordAgain: yup
      .string()
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
      })
  })
  .required();

export default function App() {
  useUser({ redirectIfFound: true, redirectTo: '/' });
  const { mutateAsync } = useMutation({
    mutationKey: ['auth/signup'],
    mutationFn: async (data: FormData) => {
      const res = await fetch('http://127.0.0.1:8000/api/signup/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.status === 201) {
        Router.push('/login');
      } else {
        alert('Something went wrong!');
      }
    }
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
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
    <form onSubmit={onSubmit} className="flex flex-col gap-2 p-4">
      <input {...register('first_name')} placeholder="First Name" />
      <input {...register('last_name')} placeholder="Last Name" />
      <input
        {...register('date_of_birth')}
        type="date"
        placeholder="Date of Birth"
      />
      <select {...register('gender')} placeholder="Gender">
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>
      <input {...register('username')} placeholder="Username" />
      <input {...register('password')} placeholder="Password" />
      <input {...register('passwordAgain')} placeholder="Password Again" />
      <button type="submit">Submit</button>
    </form>
  );
}
