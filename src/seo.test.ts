import indexHtml from '../index.html?raw';
import robots from '../public/robots.txt?raw';
import sitemap from '../public/sitemap.xml?raw';

const SITE = 'https://brunoborges.netlify.app';
const page = new DOMParser().parseFromString(indexHtml, 'text/html');

function content(selector: string): string | null {
  return page.querySelector(selector)?.getAttribute('content') ?? null;
}

describe('share preview and SEO tags in index.html', () => {
  it.each([
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:locale"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ])('has %s, which useDocumentMeta keeps in the active language', (selector) => {
    expect(content(selector), selector).toBeTruthy();
  });

  it('describes the page as a website in English, offering Portuguese as the alternate', () => {
    expect(content('meta[property="og:type"]')).toBe('website');
    expect(content('meta[property="og:locale"]')).toBe('en_US');
    expect(content('meta[property="og:locale:alternate"]')).toBe('pt_BR');
    expect(content('meta[property="og:site_name"]')).toBeTruthy();
  });

  it('points the canonical URL, og:url and the preview image at the live site with absolute https URLs', () => {
    expect(page.querySelector('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/`);
    expect(content('meta[property="og:url"]')).toBe(`${SITE}/`);
    expect(content('meta[property="og:image"]')).toBe(`${SITE}/og-image.png`);
  });

  it('gives the preview image its size and a text alternative, on a large Twitter card', () => {
    expect(content('meta[property="og:image:width"]')).toBe('1200');
    expect(content('meta[property="og:image:height"]')).toBe('630');
    expect(content('meta[property="og:image:alt"]')).toBeTruthy();
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(content('meta[name="twitter:image"]')).toBe(`${SITE}/og-image.png`);
  });

  it('describes the person with JSON-LD that links to the real profiles', () => {
    const script = page.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script?.textContent ?? '{}') as Record<string, unknown>;

    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Bruno Borges');
    expect(data.url).toBe(`${SITE}/`);
    expect(data.jobTitle).toBe('Full-Stack Developer');
    expect(data.sameAs).toEqual(['https://www.linkedin.com/in/brunooborges/', 'https://github.com/brunooborges/']);
  });

  it('keeps the CSP-friendly rule: the only inline script is the non-executable JSON-LD block', () => {
    const inlineScripts = [...page.querySelectorAll('script:not([src])')];

    expect(inlineScripts.every((script) => script.getAttribute('type') === 'application/ld+json')).toBe(true);
  });
});

describe('sitemap and robots', () => {
  it('lists the home page in the sitemap', () => {
    expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
  });

  it('lets crawlers in and points them at the sitemap', () => {
    expect(robots).toMatch(/^Disallow:\s*$/m);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
