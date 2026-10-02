import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  margin: 48px 24px 24px;
  padding-left: 100px;

  h2 {
    font-size: 64px;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.accent};
  }

  .intro {
    max-width: 640px;
    font-size: 18px;
    line-height: 26px;
    color: ${({ theme }) => theme.colors.text.main};
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .button {
    display: inline-flex;
    justify-content: center;
    padding: 12px 28px;
    border: 2px solid ${({ theme }) => theme.colors.highlight};
    border-radius: 23px;
    font-weight: 800;
    font-size: 16px;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text.light};
    overflow-wrap: anywhere;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      filter 0.2s ease;

    &.primary {
      background-color: ${({ theme }) => theme.colors.highlight};
      color: ${({ theme }) => theme.colors.onHighlight};

      &:hover {
        filter: brightness(1.15);
      }
    }

    &.secondary:hover {
      background-color: ${({ theme }) => theme.colors.primary.lighter};
      border-color: ${({ theme }) => theme.colors.text.light};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.text.light};
      outline-offset: 3px;
    }
  }

  .profiles {
    display: flex;
    gap: 24px;
    list-style: none;

    a {
      color: ${({ theme }) => theme.colors.text.main};
      font-weight: 700;
      text-underline-offset: 4px;

      &:hover {
        color: ${({ theme }) => theme.colors.text.light};
      }

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.accent};
        outline-offset: 3px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    margin: 32px 16px 16px;
    padding-left: 0;

    h2 {
      font-size: 48px;
    }

    .intro {
      font-size: 16px;
      line-height: 24px;
    }
  }
`;
