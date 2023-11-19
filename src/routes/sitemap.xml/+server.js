export const prerender = true;
import api from "@getneurotic/api";

export async function GET() {
	const response = await api.find(['page', 'product', 'seo-page']);

    const pages = response.data.items.filter(i => i.recordType.id === 'page');
    const infoPages = response.data.items.filter(i => i.recordType.id === 'seo-page');

	const prefix = 'https://www.padelpack.nl';

    let xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

	const generateUrlEntry = (url, lastmod = new Date(), changefreq = "weekly", priority = "0.5") => {
		// Format the date in the desired format
		const formattedDate = lastmod.toISOString().split('.')[0] + "+00:00";
	
		return `<url>\n<loc>${url}</loc>\n<lastmod>${formattedDate}</lastmod>\n<changefreq>${changefreq}</changefreq>\n<priority>${priority}</priority>\n</url>\n`;
	};	

    pages.forEach(page => {
        const { pathname } = page.properties;
        const excludedPages = pathname.startsWith('/account') || pathname.startsWith('/bestellen');
    
        if (!excludedPages) {
            xmlSitemap += generateUrlEntry(`${prefix}${pathname}`);
        }
    });

	infoPages.forEach(page => {
        xmlSitemap += generateUrlEntry(`${prefix}${page.properties.pathname}`);
    });

    xmlSitemap += `</urlset>`;

	return new Response(xmlSitemap, { headers: { 'Content-Type': 'application/xml' } });
}
