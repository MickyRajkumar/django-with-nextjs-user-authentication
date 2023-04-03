import { useQueryClient } from '@tanstack/react-query';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from './../hooks/useUser';
import Router from 'next/router';

const Home: NextPage = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  return (
    <>
      <Head>
        <title>Title</title>
        <meta name="description" content="" />
      </Head>

      <main>
        {user ? (
          <>
            <div className="w-fit mx-auto my-20">
              <h1 className="text-3xl">User Details</h1>
            </div>
            <div className="flex justify-center items-center mt-10">
              <div>
                <h1>User Name : {user.username}</h1>
                <p>First Name: {user.first_name}</p>
                <p>Last Name: {user.last_name}</p>
                <p>Date of Birth: {user.details.gender}</p>
                <p>Date of Birth: {user.details.date_of_birth}</p>
              </div>
            </div>
            <div className="mx-auto w-fit mt-11">
              <div>
                <button
                  onClick={() => {
                    window.localStorage.removeItem('token');
                    queryClient.refetchQueries([['auth/user']]);
                    Router.push('/login');
                  }}
                >
                  logOut
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-[50%]  mt-10 mx-auto flex justify-between">
              <button className="hover:text-blue-500">
                <Link href="/signup">Sign Up</Link>
              </button>
              <button className="hover:text-blue-500">
                <Link href="/login">Sign in</Link>
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
};

export default Home;
