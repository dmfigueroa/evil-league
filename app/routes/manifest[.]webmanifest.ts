import { json } from '@remix-run/cloudflare';

export const loader = async () => {
  return json(
    {
      short_name: 'Evil',
      name: 'Evil League',
      start_url: '/',
      display: 'standalone',
      background_color: '#1C1C1C',
      theme_color: '#2C6024',
      shortcuts: [
        {
          name: 'Evil League',
          url: '/',
          icons: [
            {
              src: '/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
              purpose: 'any monochrome',
            },
          ],
        },
      ],
      icons: [
        {
          src: '/icons/icon-36x36.png',
          sizes: '36x36',
          type: 'image/png',
          density: '0.75',
        },
        {
          src: '/icons/icon-48x48.png',
          sizes: '48x48',
          type: 'image/png',
          density: '1.0',
        },
        {
          src: '/icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          density: '1.5',
        },
        {
          src: '/icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          density: '2.0',
        },
        {
          src: '/icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          density: '3.0',
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
      ],
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    }
  );
};
