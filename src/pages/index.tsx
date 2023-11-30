import { useState } from 'react';
import Header from '@/Components/Header';
import Head from 'next/head';
import HomeContent from '@/Components/HomeContent';
import { fetchAPI } from '@/utils/Api';
import Cookies from 'js-cookie';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';

export default function Home() {
  return (
    <div className="App">
    <Head>
      <title>LetsChat</title>
      <link rel="icon" href="/favicon.jpg" />
    </Head>
    <Header />
    <HomeContent />
  </div>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token: string | undefined = context.req.cookies.token;
  const userId: string | undefined = context.req.cookies.userId;
  console.log("unauthorized",token);
  try {
    if (!token) {
      return {
        props: {
          isLogged: false,
          msg: 'Unauthorized',
        },
      };
    }
    const response = await fetch('http://localhost:4000/users/checktoken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token ? token : '',
        userId: userId ? userId : '',
      },
    });
    console.log(response)
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      console.log('Token is invalid');
      return {
        props: {
          isLogged: false,
          msg: 'Invalid token',
        },
      };
    }

    return {
      props: {
        isLogged: true,
        msg: 'User logged in',
      },
      redirect: {
        destination: '/chatrooms',
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        isLogged: false,
        msg: 'Internal server error',
      },
    };
}
}