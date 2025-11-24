import localFont from 'next/font/local';

export const raleway = localFont({
  src: [
    {
      path: '../fonts/Raleway-Variable.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-raleway',
});
