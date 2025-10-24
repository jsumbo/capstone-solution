import { Metadata } from 'next'

interface PageMetadataProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
  canonical?: string
}

export function generateMetadata({
  title,
  description,
  image = '/og-image.png',
  noIndex = false,
  canonical
}: PageMetadataProps = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://re-novate.vercel.app'
  
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: title || 'RE-Novate - Entrepreneurial Skills Platform',
      description: description || 'Interactive entrepreneurial skills development platform for high school students.',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || 'RE-Novate',
        }
      ],
    },
    twitter: {
      title: title || 'RE-Novate - Entrepreneurial Skills Platform',
      description: description || 'Interactive entrepreneurial skills development platform for high school students.',
      images: [image],
    },
  }

  if (canonical) {
    metadata.alternates = {
      canonical: canonical
    }
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false
    }
  }

  return metadata
}

// Predefined metadata for common pages
export const pageMetadata = {
  login: generateMetadata({
    title: 'Login - RE-Novate',
    description: 'Access your RE-Novate account to continue your entrepreneurial learning journey.',
    canonical: '/login'
  }),
  
  dashboard: generateMetadata({
    title: 'Dashboard - RE-Novate',
    description: 'Track your progress and continue developing your entrepreneurial skills.',
    canonical: '/dashboard',
    noIndex: true // Private page
  }),
  
  simulation: generateMetadata({
    title: 'Business Simulation - RE-Novate',
    description: 'Practice real-world business scenarios through interactive AI-powered simulations.',
    canonical: '/simulation'
  }),
  
  facilitatorDashboard: generateMetadata({
    title: 'Facilitator Dashboard - RE-Novate',
    description: 'Monitor student progress and manage your classroom learning activities.',
    canonical: '/teacher/dashboard',
    noIndex: true // Private page
  }),
  
  onboarding: generateMetadata({
    title: 'Get Started - RE-Novate',
    description: 'Begin your entrepreneurial journey with personalized learning paths.',
    canonical: '/onboarding'
  })
}

// Schema.org structured data
export const structuredData = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RE-Novate',
    description: 'Entrepreneurial Skills Development Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://re-novate.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'https://re-novate.vercel.app'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  },
  
  educationalOrganization: {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'RE-Novate',
    description: 'Interactive entrepreneurial skills development platform for high school students',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://re-novate.vercel.app',
    sameAs: [
      'https://twitter.com/renovate_edu',
      'https://linkedin.com/company/renovate-edu'
    ],
    educationalCredentialAwarded: 'Entrepreneurship Skills Certificate'
  },
  
  course: {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Entrepreneurial Skills Development',
    description: 'Comprehensive entrepreneurship education through interactive simulations',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'RE-Novate'
    },
    educationalLevel: 'High School',
    teaches: [
      'Business Planning',
      'Financial Literacy',
      'Leadership Skills',
      'Market Research',
      'Strategic Thinking'
    ]
  }
}