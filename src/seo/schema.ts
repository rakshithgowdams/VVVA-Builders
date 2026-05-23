const BASE_URL = 'https://vvva-builders.vercel.app';
const ORG_ID = `${BASE_URL}/#organization`;

export const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': ORG_ID,
  name: 'VVVA Developer',
  alternateName: ['VVVA Builders', 'VVVA Plots'],
  url: BASE_URL,
  logo: `${BASE_URL}/vvva-logo.png`,
  image: `${BASE_URL}/hero-real-estate-bg.webp`,
  telephone: '+91-9845659193',
  email: 'info@vvvabuilders.com',
  priceRange: '₹₹-₹₹₹',
  areaServed: [
    { '@type': 'City', name: 'Hassan' },
    { '@type': 'City', name: 'Channarayapatna' },
    { '@type': 'City', name: 'Holenarasipura' },
    { '@type': 'City', name: 'Arsikere' },
    { '@type': 'City', name: 'Sakleshpur' },
    { '@type': 'City', name: 'Belur' },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Opp Canara Bank, Near MCE College, Salagame Road',
    addressLocality: 'Hassan',
    addressRegion: 'Karnataka',
    postalCode: '573201',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0033,
    longitude: 76.0959,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  sameAs: [
    'https://www.instagram.com/vvva_developer',
    'https://www.facebook.com/vvvadeveloper',
  ],
  founder: { '@type': 'Person', name: 'Rakshith' },
  foundingDate: '2015',
  knowsAbout: [
    'Residential Plots',
    'DTCP Approval',
    'BMRDA Approval',
    'RERA Registration',
    'Gated Community Development',
    'Land Development Hassan',
  ],
};

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'VVVA Developer',
  image: `${BASE_URL}/hero-real-estate-bg.webp`,
  telephone: '+91-9845659193',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Opp Canara Bank, Near MCE College, Salagame Road',
    addressLocality: 'Hassan',
    addressRegion: 'Karnataka',
    postalCode: '573201',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0033,
    longitude: 76.0959,
  },
  url: BASE_URL,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
  ],
  priceRange: '₹₹-₹₹₹',
};

export function makeProjectSchema(project: {
  id: number;
  name: string;
  slug?: string;
  location: string;
  description: string;
  card_image_url: string;
  price_range: string;
  rera_number: string;
  status: string;
  total_area_acres: number;
}) {
  const url = `${BASE_URL}/projects/${project.slug || project.id}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${project.name} — Residential Plots in ${project.location}`,
    description: project.description,
    image: project.card_image_url,
    url,
    brand: { '@type': 'Brand', name: 'VVVA Developer' },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '',
      highPrice: '',
      offerCount: 1,
      availability: project.status === 'open'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'RERA Number',
        value: project.rera_number || 'Applied',
      },
      {
        '@type': 'PropertyValue',
        name: 'Total Area',
        value: `${project.total_area_acres} Acres`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Approval Status',
        value: 'DTCP Approved',
      },
    ],
  };
}

export function makeFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

export function makeBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function makeArticleSchema(post: {
  title: string;
  excerpt: string;
  hero_image_url: string;
  published_at?: string;
  updated_at?: string;
  slug: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.hero_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Rakshith',
      url: `${BASE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'VVVA Developer',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/vvva-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

export function makeProjectListSchema(projects: { id: number; name: string; slug?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'VVVA Developer Residential Plot Projects',
    description: 'All current and upcoming residential plot projects by VVVA Developer in Hassan, Karnataka.',
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${BASE_URL}/projects/${p.slug || p.id}`,
    })),
  };
}
