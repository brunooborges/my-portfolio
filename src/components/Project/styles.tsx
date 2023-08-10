import { keyframes, styled } from 'styled-components';

interface ProjectProps {
  'data-isactive'?: boolean;
}

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

export const Container = styled.div<ProjectProps>`
  align-self: stretch;
  flex: 1;
  display: ${({ 'data-isactive': isActive }) => (isActive ? 'flex' : 'none')};
  justify-content: space-around;
  align-items: center;
  max-height: 100vh;
  height: 100%;

  .link-button {
    display: flex;
    justify-content: center;
    text-align: center;
    border: none;
    background-color: ${({ theme }) => theme.colors.highlight};
    padding: 10px 30px;
    border-radius: 23px;
    margin-top: 30px;
    cursor: pointer;

    a {
      text-decoration: none;
      font-weight: 800;
      font-size: 16px;
      transition: all 0.2s ease-out;
      color: ${({ theme }) => theme.colors.primary.main};
    }

    &:hover {
      a {
        color: ${({ theme }) => theme.colors.text.light};
      }
    }
  }

  .left-section {
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    width: 33%;
    left: -35px;
    opacity: 0;
    margin-left: 16px;
    margin-right: 36px;
    animation: ${fadeFromLeft} 2s 0.6s forwards cubic-bezier(0, 1.01, 0.32, 1);

    h1 {
      font-size: 48px;
      line-height: 50px;
      font-weight: 400;
      text-align: left;
      margin-bottom: 30px;
      color: ${({ theme }) => theme.colors.text.main};
    }

    p {
      text-align: justify;
      color: ${({ theme }) => theme.colors.text.main};
      white-space: break-spaces;
    }
  }

  .right-section {
    align-self: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    height: 100%;

    .bg-effect {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
      background-color: ${({ theme }) => theme.colors.primary.lighter};
      transform: scale(0);
      animation: ${scaleRight} 0.7s 0.2s forwards cubic-bezier(0, 1.01, 0.32, 1);

      img {
        height: auto;
        width: 100%;
        padding: 8px;
        transform: scale(0);
        animation: ${scaleUp} 0.5s 0.3s forwards cubic-bezier(0, 1.01, 0.32, 1);
        cursor: pointer;
      }
    }
  }

  @media only screen and (max-width: 1260px) {
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    max-width: 100%;

    .left-section {
      margin: 0px auto;
      align-items: center;
      height: 100%;
      width: 100%;

      h1 {
        font-size: 36px;
        text-align: center;
      }

      p {
        font-size: 16px;
      }
    }
    .right-section {
      width: 100%;

      .bg-effect {
        width: 100%;
        height: 100%;
        margin: 0;
        margin-top: 32px;

        img {
          height: auto;
          width: 100%;
          padding: 8px;
        }
        .link-button {
          position: fixed;
          top: unset;
          left: unset;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .left-section {
      h1 {
        font-size: 32px;
        text-align: center;
      }

      p {
        font-size: 12px;
      }
    }
  }
`;
