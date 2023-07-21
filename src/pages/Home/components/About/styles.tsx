import { css, keyframes, styled } from 'styled-components';

interface ContainerProps {
  'data-isvisible'?: boolean;
}

const slideFromLeft = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

const slideFromRight = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`;

export const Container = styled.section<ContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px;
  padding-left: 24px;
  overflow: hidden;
  padding-left: 100px;

  .about-me {
    h2 {
      font-size: 64px;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.highlight};
    }

    .infos {
      display: flex;
      align-items: center;

      .slide-from-left {
        p {
          margin-top: 8px;
          font-size: 18px;
          text-align: justify;
          max-width: 80%;
          width: 100%;
          line-height: 24px;
          color: ${({ theme }) => theme.colors.text.main};
        }

        ${({ 'data-isvisible': isVisible }) =>
          isVisible &&
          css`
            animation: ${slideFromLeft} 1s both;
          `}
      }

      .slide-from-right {
        img {
          height: 250px;
          margin-right: 240px;
        }
        ${({ 'data-isvisible': isVisible }) =>
          isVisible &&
          css`
            animation: ${slideFromRight} 1s both;
          `}
      }
    }
  }

  .techs {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin-top: 60px;
    gap: 8px;

    .tech {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      max-width: 110px;
      max-height: 110px;

      span {
        font-weight: 800;
        font-size: 12px;
        margin-top: 8px;
      }
      img {
        width: 100%;
        height: 100%;
        max-width: 60px;
        max-height: 60px;
        margin: 8px 0;
      }
    }

    .tech.top {
      border: 1px solid;
      border-image: linear-gradient(to bottom, #3f51b5, #000);
      border-image-slice: 1;
    }
    .tech.bot {
      border: 1px solid;
      border-image: linear-gradient(to top, #3f51b5, #000);
      border-image-slice: 1;
    }
  }

  @media only screen and (max-width: 700px) {
    margin: auto;
    margin-top: 24px;
    padding-left: 0px;

    .about-me {
      h2 {
        font-size: 32px;
      }

      .infos {
        flex-direction: column;

        .slide-from-left {
          p {
            font-size: 12px;
            max-width: 100%;
            line-height: 16px;
            margin-top: 16px;
          }
        }

        .slide-from-right {
          img {
            height: 200px;
            margin-top: 12px;
            margin-right: 0;
            margin: 16px 0;
          }
        }
      }
    }

    .techs {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      justify-items: center;
      margin: auto;
      width: auto;

      .tech {
        padding: 0 4px;
        img {
          width: 50px;
          height: auto;
        }
      }

      .tech.tailwind {
        grid-column-start: 1;
        grid-column-end: 3;
        justify-self: center;
      }
    }
  }

  @media only screen and (min-width: 701px) and (max-width: 1024px) {
    margin: auto;
    margin-top: 24px;
    padding-left: 0px;

    .about-me {
      h2 {
        font-size: 32px;
      }

      .infos {
        flex-direction: column;

        .slide-from-left {
          p {
            font-size: 16px;
            max-width: 100%;
            line-height: 20px;
            margin-top: 16px;
          }
        }

        .slide-from-right {
          img {
            height: 200px;
            margin-top: 12px;
            margin-right: 0;
            margin: 16px 0;
          }
        }
      }
    }
    .techs {
      margin: auto;
      width: 100%;

      .tech {
        padding: 0 4px;

        img {
          width: 50px;
          height: auto;
        }
      }
    }
  }
`;
