export default function manifest() {
  return {
    name: 'ForexInstincts',
    short_name: 'ForexInstincts',
    description: 'Build professional automated trading bots without writing code. Deploy to MT4, MT5, or TradingView instantly, one-time payment per bot.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fef3f8',
    theme_color: '#ec4899',
    categories: ['finance', 'trading', 'forex', 'automation', 'business'],

    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/assets/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],

    prefer_related_applications: false,

    lang: 'en',
    dir: 'ltr',

    shortcuts: [
      {
        name: 'Build a Bot',
        short_name: 'Build',
        description: 'Start building your trading bot',
        url: '/buildbot',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Bot Pricing',
        short_name: 'Pricing',
        description: 'View bot tier pricing',
        url: '/tiers',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'My Dashboard',
        short_name: 'Dashboard',
        description: 'View my trading bots',
        url: '/dashboard',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      }
    ],

    screenshots: [
      {
        src: '/assets/banner.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Home Screen'
      }
    ]
  }
}
