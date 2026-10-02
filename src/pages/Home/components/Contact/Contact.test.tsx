import { screen, within } from '@testing-library/react';

import i18n from '../../../../i18n';
import { renderWithProviders } from '../../../../test/renderWithProviders';
import Contact from '.';

const cvFiles = import.meta.glob('../../../../../public/cv/*.pdf');

describe('Contact', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en-US');
  });

  it('renders the section with the id used by the navigation', () => {
    const { container } = renderWithProviders(<Contact id='contact' />);

    expect(container.querySelector('section#contact')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument();
  });

  it('invites recruiters to get in touch', () => {
    renderWithProviders(<Contact id='contact' />);

    expect(screen.getByText(/open to new opportunities/i)).toBeInTheDocument();
  });

  it('offers a mailto link that shows the address', () => {
    renderWithProviders(<Contact id='contact' />);

    const email = screen.getByRole('link', { name: /bborgesfilho33@gmail\.com/ });

    expect(email).toHaveAttribute('href', 'mailto:bborgesfilho33@gmail.com');
  });

  it('links to LinkedIn and GitHub in a new tab, without leaking the opener', () => {
    renderWithProviders(<Contact id='contact' />);

    const linkedin = screen.getByRole('link', { name: /LinkedIn/ });
    const github = screen.getByRole('link', { name: /GitHub/ });

    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/brunooborges/');
    expect(github).toHaveAttribute('href', 'https://github.com/brunooborges/');
    for (const link of [linkedin, github]) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    }
  });

  it('downloads the English resume while the site is in English', () => {
    renderWithProviders(<Contact id='contact' />);

    const cv = screen.getByRole('link', { name: 'Download resume (PDF)' });

    expect(cv).toHaveAttribute('href', '/cv/bruno-borges-resume-en-us.pdf');
    expect(cv).toHaveAttribute('download', 'Bruno_de_Oliveira_Borges_Filho_Resume_EN-US.pdf');
  });

  it('switches everything, including the resume, to Portuguese', async () => {
    renderWithProviders(<Contact id='contact' />);

    await i18n.changeLanguage('pt-BR');

    expect(await screen.findByRole('heading', { level: 2, name: 'Contato' })).toBeInTheDocument();
    const cv = screen.getByRole('link', { name: 'Baixar currículo (PDF)' });
    expect(cv).toHaveAttribute('href', '/cv/bruno-borges-curriculo-pt-br.pdf');
    expect(cv).toHaveAttribute('download', 'Bruno_de_Oliveira_Borges_Filho_Curriculo_PT-BR.pdf');
    expect(screen.getByText(/disponível para novas oportunidades/i)).toBeInTheDocument();
  });

  it('only links resumes that exist in public/cv', () => {
    renderWithProviders(<Contact id='contact' />);
    const section = screen.getByRole('region', { name: 'Contact' });
    const href = within(section).getByRole('link', { name: 'Download resume (PDF)' }).getAttribute('href');

    expect(Object.keys(cvFiles).map((path) => `/cv/${path.split('/').pop() ?? ''}`)).toEqual(
      expect.arrayContaining([href, '/cv/bruno-borges-curriculo-pt-br.pdf']),
    );
  });
});
