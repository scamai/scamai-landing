import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { getPublishedNewsletters } from '@/lib/db/newsletters'
import { getAllIndustrySlugs } from '@/lib/solutions/industries'
import { getAllCompetitorSlugs } from '@/lib/compare/competitors'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://scam.ai'

  // Static pages
  const routes = [
    '',
    '/products',
    '/products/ai-detection',
    '/products/audio-detection',
    '/resources',
    '/resources/documentation',
    '/resources/security-compliance',
    '/pricing',
    '/about',
    '/contact',
    '/demo',
    '/msa',
    '/privacy',
    '/terms',
    '/cookies',
    '/newsletter',
    '/research',
    '/company',
    '/news',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static routes for all locales
  routes.forEach(route => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : route.includes('/products') ? 0.9 : 0.7,
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map(l => [l, `${baseUrl}/${l}${route}`])
            ),
            'x-default': `${baseUrl}/en${route}`,
          }
        }
      })
    })
  })

  // Add industry solution pages
  const industrySlugs = getAllIndustrySlugs()
  industrySlugs.forEach(slug => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/solutions/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map(l => [l, `${baseUrl}/${l}/solutions/${slug}`])),
            'x-default': `${baseUrl}/en/solutions/${slug}`,
          }
        }
      })
    })
  })

  // Add solutions hub
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map(l => [l, `${baseUrl}/${l}/solutions`])),
          'x-default': `${baseUrl}/en/solutions`,
        }
      }
    })
  })

  // Add competitor comparison pages
  const competitorSlugs = getAllCompetitorSlugs()
  competitorSlugs.forEach(slug => {
    locales.forEach(locale => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/compare/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map(l => [l, `${baseUrl}/${l}/compare/${slug}`])),
            'x-default': `${baseUrl}/en/compare/${slug}`,
          }
        }
      })
    })
  })

  // Add compare hub
  locales.forEach(locale => {
    sitemapEntries.push({
      url: `${baseUrl}/${locale}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map(l => [l, `${baseUrl}/${l}/compare`])),
          'x-default': `${baseUrl}/en/compare`,
        }
      }
    })
  })

  // Add dynamic newsletter pages
  try {
    const newsletters = await getPublishedNewsletters()
    newsletters.forEach(nl => {
      locales.forEach(locale => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/newsletter/${nl.slug || nl.id}`,
          lastModified: new Date(nl.date),
          changeFrequency: 'monthly',
          priority: 0.6,
          alternates: {
            languages: {
              ...Object.fromEntries(
                locales.map(l => [l, `${baseUrl}/${l}/newsletter/${nl.slug || nl.id}`])
              ),
              'x-default': `${baseUrl}/en/newsletter/${nl.slug || nl.id}`,
            }
          }
        })
      })
    })
  } catch {
    // DB unavailable during build — skip dynamic entries
  }

  return sitemapEntries
}
