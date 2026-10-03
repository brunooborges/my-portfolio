import styled from 'styled-components';

export const Container = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary.light};
  border: 1px solid ${({ theme }) => theme.colors.primary.lighter};

  button {
    min-width: 40px;
    padding: 6px 12px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: ${({ theme }) => theme.colors.text.main};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.text.light};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }

    &[aria-pressed='true'] {
      background: ${({ theme }) => theme.colors.highlight};
      color: ${({ theme }) => theme.colors.onHighlight};
    }
  }
`;
