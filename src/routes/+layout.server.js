import api from "@getneurotic/api";
import { error } from "@sveltejs/kit";

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const response = await api.find(['block', 'page', 'product', 'review', 'faq', 'seo-page']);
	
	if (response.status >= 400) {
		throw error(response.status, response.statusText);
	}

	const pages = response.data.items.filter(i => i.recordType.id === 'page');
	const page = pages.find(r => r.properties.pathname === url.pathname);

	const seoPages = response.data.items.filter(i => i.recordType.id === 'seo-page');
    const seoPage = seoPages.find(r => r.properties.pathname === url.pathname);
	
	const blocks = response.data.items.filter(i => i.recordType.id === 'block');
	const faqs = response.data.items.filter(i => i.recordType.id === 'faq');
	const products = response.data.items.filter(i => i.recordType.id === 'product');
	const reviews = response.data.items.filter(i => i.recordType.id === 'review');

    return { page, pages, products, blocks, reviews, faqs, seoPages, seoPage };
}