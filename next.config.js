const withAntdLess = require('next-plugin-antd-design')
const withBundleAnalyzer = require('@next/bundle-analyzer')

const system = require('./config/system')

const isProd = process.env.NODE_ENV === 'production'
const isAnalyzer = process.env.REACT_APP_BUNDLE_VISUALIZE === '1'

module.exports = () => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
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
        minify: isProd,
        namespace: 'turbo',
        pure: true,
        transpileTemplateLiterals: true
      }
    },
    experimental: {
      swcPlugins: [
        [
          'swc-plugin-transform-imp',
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
  }

  const plugins = [
    withAntdLess({
      modifyVars: system.antd.variables
    })
  ]

  if (isAnalyzer) plugins.push(
    withBundleAnalyzer({
      enabled: true
    })
  )
  
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig })
}
