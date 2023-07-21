import { css, keyframes, styled } from 'styled-components';

interface ContainerProps {
  'data-isscrolled'?: boolean;
}

const fadeOut = keyframes`
    to {
    opacity: 0;
  }
`;

const arrowDown = keyframes`
  0% {
    top: 76px;
  }

  30% {
    top: 79px;
    opacity: 1;
  }

  70% {
    bottom: 84px;
    opacity: 1;
  }

  100% {
    bottom: 85px;
    opacity: 0;
  }
`;

const lineDown = keyframes`
0% {
    transform: scale(1, 0);
    transform-origin: top center;
  }

  25% {
    transform: scale(1, 1);
    transform-origin: top center;
  }

  75% {
    transform: scale(1, 1);
    transform-origin: top center;
  }

  76% {
    transform: scale(1, 1);
    transform-origin: bottom center;
  }

  100% {
    transform: scale(1, 0);
    transform-origin: bottom center;
  }

`;

export const Container = styled.section<ContainerProps>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary.light};
  margin: 24px;
  height: calc(100vh + 20px);
  padding-left: 100px;
  overflow-y: auto;

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    p {
      color: ${({ theme }) => theme.colors.highlight};
      font-weight: 800;
      font-size: 30px;
    }

    h1 {
      color: ${({ theme }) => theme.colors.text.light};
      font-weight: 800;
      font-size: 90px;
    }

    h2 {
      color: ${({ theme }) => theme.colors.text.main};
      font-weight: 800;
      font-size: 80px;
    }

    a {
      text-decoration: none;

      img {
        margin-top: 16px;
        background-color: ${({ theme }) => theme.colors.highlight};
        border-radius: 5px;
        transition: transform 0.5s ease;

        &:first-child {
          margin-right: 10px;
        }

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }

  .scroll {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 70px;
    max-height: 150px;
    border-radius: 35px 35px 0 0;
    background-color: ${({ theme }) => theme.colors.highlight};
    position: absolute;
    bottom: -44px;
    left: 0;
    right: 0;
    margin: 0 auto;
    overflow-y: auto;

    ${({ 'data-isscrolled': isScrolled }) =>
      isScrolled &&
      css`
        animation: ${fadeOut} 1s forwards ease-out;
      `};

    .arrow {
      display: block;
      width: 100%;
      height: 75px;
      margin-top: 30px;

      &::before {
        content: '';
        width: 2px;
        height: 55px;
        display: block;
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: ${({ theme }) => theme.colors.primary.dark};
        animation: ${lineDown} 1.2s ease-out 1s infinite;
        transform-origin: top center;
      }

      img {
        width: 16px;
        height: 25px;
        display: block;
        position: absolute;
        bottom: 50px;
        top: 85px;
        left: 0;
        right: 0;
        margin: 0 auto;
        opacity: 0;
        animation: ${arrowDown} 1.2s linear 1s infinite;
      }
    }
  }

  @media only screen and (max-width: 635px) {
    margin: auto;
    padding-left: 8px;
    .info {
      p {
        font-size: 16px;
      }
      h1 {
        font-size: 28px;
      }
      h2 {
        font-size: 20px;
      }
    }
  }
`;
