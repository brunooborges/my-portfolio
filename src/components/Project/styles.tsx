import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
100% {
  transform: scale(1);
}
`;

const scaleRight = keyframes`
100% {
  transform: scaleX(1);
}`;

const fadeFromLeft = keyframes`
100% {
    left: 0;
    opacity: 1;
}
`;

export const Container = styled.article`
  align-self: stretch;
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 24px;

  .link-button {
    display: inline-flex;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    font-weight: 800;
    font-size: 16px;
    border: none;
    background-color: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.primary.main};
    padding: 10px 30px;
    border-radius: 23px;
    margin-top: 24px;
    cursor: pointer;
    transition: color 0.2s ease-out;

    &:hover {
      color: ${({ theme }) => theme.colors.text.light};
    }

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.text.light};
      outline-offset: 3px;
    }
  }

  .left-section {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 40%;
    left: -35px;
    opacity: 0;
    margin-left: 16px;
    margin-right: 16px;
    animation: ${fadeFromLeft} 2s 0.6s forwards cubic-bezier(0, 1.01, 0.32, 1);

    h3 {
      font-size: 48px;
      line-height: 50px;
      font-weight: 400;
      text-align: left;
      margin-bottom: 16px;
      color: ${({ theme }) => theme.colors.text.main};
    }

    .badge {
      display: inline-flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 16px;
      padding: 6px 12px;
      border-left: 3px solid ${({ theme }) => theme.colors.highlight};
      background: ${({ theme }) => theme.colors.primary.lighter};

      span {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.text.light};
      }

      small {
        font-size: 12px;
        color: ${({ theme }) => theme.colors.text.main};
      }
    }

    .summary {
      text-align: left;
      line-height: 24px;
      color: ${({ theme }) => theme.colors.text.main};
    }

    .highlights {
      margin-top: 16px;
      padding-left: 20px;
      color: ${({ theme }) => theme.colors.text.main};
      line-height: 22px;

      li + li {
        margin-top: 6px;
      }

      li::marker {
        color: ${({ theme }) => theme.colors.highlight};
      }
    }

    .tech-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 20px;
      list-style: none;

      li {
        padding: 4px 10px;
        border: 1px solid ${({ theme }) => theme.colors.slider};
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.text.main};
      }
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 0 16px;
    }
  }

  .right-section {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;

    .bg-effect {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
      /* No frame colour or padding: the screenshot itself fills the whole area.
         A hairline keeps its dark edges readable against the card. */
      background-color: transparent;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
      transform: scale(0);
      animation: ${scaleRight} 0.7s 0.2s forwards cubic-bezier(0, 1.01, 0.32, 1);

      .screenshot-button {
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: zoom-in;
        transform: scale(0);
        animation: ${scaleUp} 0.5s 0.3s forwards cubic-bezier(0, 1.01, 0.32, 1);

        &:focus-visible {
          outline: 2px solid ${({ theme }) => theme.colors.highlight};
          outline-offset: -2px;
        }

        img {
          display: block;
          width: 100%;
          /* One box for every screenshot so the card keeps its height when switching.
             cover fills it edge to edge; tall screenshots show their top part here and
             in full when enlarged. */
          aspect-ratio: 11 / 6;
          object-fit: cover;
          object-position: center top;
        }
      }
    }

    .caption {
      width: 100%;
      margin-top: 12px;
      font-size: 13px;
      line-height: 18px;
      color: ${({ theme }) => theme.colors.text.main};
    }

    .thumbs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      width: 100%;
      margin-top: 12px;
      list-style: none;

      button {
        display: block;
        width: 72px;
        padding: 0;
        border: 2px solid transparent;
        border-radius: 4px;
        background: ${({ theme }) => theme.colors.primary.lighter};
        opacity: 0.6;
        overflow: hidden;
        transition:
          opacity 0.2s ease,
          border-color 0.2s ease;

        &:hover {
          opacity: 1;
        }

        &[aria-pressed='true'] {
          opacity: 1;
          border-color: ${({ theme }) => theme.colors.highlight};
        }

        &:focus-visible {
          outline: 2px solid ${({ theme }) => theme.colors.text.light};
          outline-offset: 2px;
        }

        img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          object-position: top left;
        }
      }
    }

    .placeholder {
      flex-direction: column;
      gap: 12px;
      aspect-ratio: 11 / 6;
      background: linear-gradient(
        135deg,
        ${({ theme }) => theme.colors.primary.lighter},
        ${({ theme }) => theme.colors.primary.dark}
      );
      border: 1px dashed ${({ theme }) => theme.colors.slider};

      .monogram {
        font-size: 96px;
        line-height: 1;
        font-weight: 800;
        color: ${({ theme }) => theme.colors.highlight};
      }

      .placeholder-text {
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${({ theme }) => theme.colors.text.main};
      }
    }
  }

  /* Phone screenshots: a narrow, tall frame with the same aspect ratio as the images, so they
     are shown whole and edge to edge instead of being cropped into the landscape box. */
  &[data-orientation='portrait'] .right-section {
    .bg-effect {
      width: min(100%, 250px);
    }

    .screenshot-button img {
      aspect-ratio: 590 / 1204;
      object-position: center;
    }

    .caption {
      max-width: 340px;
      text-align: center;
    }

    .thumbs {
      justify-content: center;

      button {
        width: 44px;

        img {
          aspect-ratio: 590 / 1204;
          object-position: center;
        }
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .left-section,
    .right-section .bg-effect,
    .right-section .bg-effect .screenshot-button {
      animation-duration: 0.01ms;
      animation-delay: 0s;
    }
  }

  @media only screen and (max-width: 1260px) {
    flex-direction: column;
    justify-content: center;
    max-width: 100%;

    .left-section {
      margin: 0px auto;
      align-items: center;
      width: 100%;

      h3 {
        font-size: 36px;
        text-align: center;
      }

      .summary {
        font-size: 16px;
        text-align: center;
      }

      .tech-list {
        justify-content: center;
      }

      .links {
        justify-content: center;
      }
    }

    .right-section {
      width: 100%;

      .bg-effect {
        margin: 0;
        margin-top: 8px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .left-section {
      h3 {
        font-size: 32px;
      }

      .summary,
      .highlights {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
`;
