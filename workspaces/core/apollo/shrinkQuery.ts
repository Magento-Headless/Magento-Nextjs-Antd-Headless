import { stripIgnoredCharacters } from 'graphql/utilities/stripIgnoredCharacters'

/**
 * @param {string | URL} Absolute URL for GraphQL GET query
 * @returns {string} Absolute URL, with shrunken query
 */
export const shrinkQuery = (fullURL: string) => {
  const url = new URL(fullURL)

  // Read from URL implicitly decodes the querystring
  const query = url.searchParams.get('query')
  if (!query) {
    return fullURL
  }

  const strippedQuery = stripIgnoredCharacters(query)

  // URLSearchParams.set will use application/x-www-form-urlencoded encoding
  url.searchParams.set('query', strippedQuery)

  return url.toString()
}
