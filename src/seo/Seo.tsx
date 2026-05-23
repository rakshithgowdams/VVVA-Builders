import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://vvva-builders.vercel.app';
const DEFAULT_IMAGE = `${BASE_URL}/hero-real-estate-bg.webp`;

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object | object[];
  noindex?: boolean;
}

export default function Seo({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema,
  noindex = false,
}: SeoProps) {
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <link rel="alternate" hreflang="en-IN" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="VVVA Developer" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD schemas */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
