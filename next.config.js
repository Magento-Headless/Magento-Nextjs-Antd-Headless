const withAntdLess = require('next-plugin-antd-less')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.REACT_APP_BUNDLE_VISUALIZE === '1'
})

const isProd = process.env.NODE_ENV === 'production'

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = withAntdLess({
    reactStrictMode: true,
    swcMinify: true,
    compress: false,
    distDir: '.next',
    generateEtags: false,
    pageExtensions: ['tsx', 'ts'],
    compiler: {
      styledComponents: {
        ssr: true,
        displayName: true,
        fileName: false,
        minify: true,
        namespace: 'headless',
        pure: true,
        transpileTemplateLiterals: true
      }
    },
    experimental: {
      swcPlugins: [
        [
          'swc-plugin-another-transform-imports',
          {
            antd: {
              transform: 'antd/lib/${member}',
              skipDefaultConversion: false,
              preventFullImport: true,
              style: 'antd/lib/${member}/style',
              memberTransformers: ['dashed_case']
            }
          }
        ]
      ]
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
    },
    webpack: (config, {}) => {
      // Important: return the modified config
      return config
    }
  })

  return isProd ? withBundleAnalyzer(nextConfig) : nextConfig
}
