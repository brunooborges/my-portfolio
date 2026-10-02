import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;

  .panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 760px;
    max-height: calc(100vh - 48px);
    max-height: calc(100dvh - 48px);
    background: ${({ theme }) => theme.colors.primary.light};
    border-radius: 16px;
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.hairline};
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    padding: 24px 24px 16px 32px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary.lighter};

    h2 {
      display: flex;
      flex-direction: column;
      font-size: 32px;
      line-height: 1.1;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.text.light};

      small {
        margin-top: 6px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.accent};
      }
    }
  }

  .close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary.lighter};
    color: ${({ theme }) => theme.colors.text.light};
    font-size: 28px;
    line-height: 1;

    &:hover {
      background: ${({ theme }) => theme.colors.highlight};
      color: ${({ theme }) => theme.colors.onHighlight};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: 2px;
    }
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 24px 32px 32px;
    overflow-y: auto;
    overscroll-behavior: contain;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.accent};
      outline-offset: -4px;
    }

    section h3 {
      margin-bottom: 8px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.accent};
    }

    p {
      font-size: 16px;
      line-height: 26px;
      color: ${({ theme }) => theme.colors.text.main};
    }

    .outcome {
      color: ${({ theme }) => theme.colors.text.light};
      font-weight: 700;
    }
  }

  /* Numbered steps joined by a line: reads as a pipeline and stacks cleanly on a phone. */
  .flow {
    list-style: none;
    counter-reset: step;

    li {
      position: relative;
      counter-increment: step;
      padding: 0 0 20px 48px;

      &::before {
        content: counter(step);
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.highlight};
        color: ${({ theme }) => theme.colors.onHighlight};
        font-size: 14px;
        font-weight: 800;
      }

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: 14px;
        top: 34px;
        bottom: 4px;
        width: 2px;
        background: ${({ theme }) => theme.colors.slider};
      }

      &:last-child {
        padding-bottom: 0;
      }

      strong {
        display: block;
        margin-bottom: 2px;
        font-size: 17px;
        line-height: 30px;
        color: ${({ theme }) => theme.colors.text.light};
      }
    }
  }

  @media only screen and (max-width: 640px) {
    padding: 12px;

    .panel {
      max-height: calc(100vh - 24px);
      max-height: calc(100dvh - 24px);
    }

    header {
      padding: 16px 16px 12px 20px;

      h2 {
        font-size: 26px;
      }
    }

    .body {
      padding: 20px;
    }
  }
`;
