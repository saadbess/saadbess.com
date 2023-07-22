module.exports = {
  url: process.env.URL || 'http://localhost:8080',
  siteName: 'Saad Koubeissi',
  siteDescription: 'Personal Web site of Saad Koubeissi',
  siteType: 'Person', // schema
  locale: 'en_EN',
  lang: 'en',
  skipContent: 'Skip to content',
  author: 'Saad Koubeissi',
  authorEmail: 'hello@saadbess.com',
  authorWebsite: 'https://www.saadbess.com',
  themeColor: '#3959e7', //  Manifest: defines the default theme color for the application
  themeBgColor: '#F3F3F3', // Manifest: defines a placeholder background color for the application page to display before its stylesheet is loaded
  meta_data: {
    opengraph_default: '/assets/images/opengraph-default.jpg', // fallback/default meta image
    opengraph_default_alt:
      'saadbess.com | Personal Web site of Saad Koubeissi', // alt text for default meta image
    twitterSite: '', // i.e. @site - twitter profile of the site
    twitterCreator: '', // i.e. @author -  twitter profile of the site
    mastodonProfile: '' // i.e. https://front-end.social/@ - url to your mastodon instance/profile
  },
  blog: {
    // this is for the rss feed
    name: 'Personal Web site of Saad Koubeissi',
    description:
      'This blog artfully explores the intricacies of front-end web engineering alongside insightful discussions on engineering management and a myriad of other subjects.'
  },
  pagination: {
    itemsPerPage: 20
  },
  address: {
    // edit all presets or leave empty. They are being used in the pages for privacy.md and imprint.md
    firma: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    mobileDisplay: '',
    mobileCall: '',
    email: 'hello@saadbess.com',
    cif: ''
  },
  menu: {
    closedText: 'Menu'
  }
};
