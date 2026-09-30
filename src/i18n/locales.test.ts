import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

type Node = string | Node[] | { [key: string]: Node };

function flatten(node: Node, prefix = ''): Record<string, string> {
  if (typeof node === 'string') {
    return { [prefix]: node };
  }

  const entries: Array<[string, Node]> = Array.isArray(node)
    ? node.map((value, index): [string, Node] => [String(index), value])
    : Object.entries(node);

  return entries.reduce<Record<string, string>>(
    (acc, [key, value]) => ({
      ...acc,
      ...flatten(value, prefix === '' ? key : `${prefix}.${key}`),
    }),
    {},
  );
}

describe('locale files', () => {
  const en = flatten(enUS);
  const pt = flatten(ptBR);

  it('define exactly the same keys in en-US and pt-BR', () => {
    expect(Object.keys(pt).sort()).toEqual(Object.keys(en).sort());
  });

  it('have no empty values', () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value.trim(), `en-US ${key}`).not.toBe('');
    }
    for (const [key, value] of Object.entries(pt)) {
      expect(value.trim(), `pt-BR ${key}`).not.toBe('');
    }
  });

  it('use the same interpolation placeholders in both languages', () => {
    const placeholders = (text: string): string[] => (text.match(/\{\{\s*\w+\s*\}\}/g) ?? []).sort();

    for (const key of Object.keys(en)) {
      expect(placeholders(pt[key]), key).toEqual(placeholders(en[key]));
    }
  });

  it('have the same number of About paragraphs', () => {
    expect(ptBR.about.paragraphs).toHaveLength(enUS.about.paragraphs.length);
    expect(enUS.about.paragraphs).toHaveLength(4);
  });

  it('no longer includes the "always been drawn to technology" paragraph', () => {
    expect(enUS.about.paragraphs.join(' ')).not.toMatch(/always been drawn to technology/);
    expect(ptBR.about.paragraphs.join(' ')).not.toMatch(/sempre fui atraído por tecnologia/i);
  });
});
