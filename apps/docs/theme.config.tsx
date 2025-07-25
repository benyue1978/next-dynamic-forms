import { useConfig } from 'nextra-theme-docs'
import { useRouter } from 'next/router'

export default {
  logo: <span>Next Dynamic Forms</span>,
  project: {
    link: 'https://github.com/benyue1978/next-dynamic-forms'
  },
  docsRepositoryBase: 'https://github.com/benyue1978/next-dynamic-forms/tree/main/apps/docs',
  footer: {
    text: 'MIT 2024 © Next Dynamic Forms'
  },
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Next Dynamic Forms'
      }
    }
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter()
    const { frontMatter } = useConfig()
    const url =
      'https://next-dynamic-forms.vercel.app' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`)

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || 'Next Dynamic Forms'} />
        <meta
          property="og:description"
          content={frontMatter.description || 'A modern, configuration-driven dynamic form system for React and Next.js'}
        />
      </>
    )
  }
}