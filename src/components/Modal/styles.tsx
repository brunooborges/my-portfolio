import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
100% {
  transform: scale(1);
}
`;

export const Container = styled.div`
  .image-background {
    position: fixed;
    inset: 0;
    display: flex;
    /* Scrolls when the screenshot is taller than the screen, so all of it can be seen. */
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    padding: 24px;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99999;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.highlight};
      outline-offset: -4px;
    }

    img {
      /* margin: auto centers a short image and lets a tall one start at the top
         (align-items: center would push its top out of reach). */
      margin: auto;
      flex-shrink: 0;
      width: min(70vw, 1500px);
      height: auto;
      transform: scale(0);
      animation: ${scaleUp} 0.5s 0.3s forwards cubic-bezier(0, 1.01, 0.32, 1);
    }
  }

  .closer {
    position: fixed;
    top: 40px;
    right: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    cursor: pointer;
    color: #fff;
    font-size: 40px;
    line-height: 1;
    z-index: 100000;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.highlight};
      outline-offset: 2px;
    }
  }

  @media only screen and (max-width: 1260px) {
    .image-background {
      padding: 16px;

      img {
        width: 92vw;
      }
    }

    .closer {
      top: 16px;
      right: 16px;
    }
  }
`;
