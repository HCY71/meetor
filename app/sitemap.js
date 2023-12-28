import { MetadataRoute } from 'next'

export default function sitemap() {
    return [
        {
            url: 'https://www.meetor.app',
            lastModified: new Date(),
        },
        {
            url: 'https://www.meetor.app/about',
            lastModified: new Date(),
        }
    ]
}