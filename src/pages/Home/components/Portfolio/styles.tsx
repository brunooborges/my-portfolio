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
}
`;

const fadeFromLeft = keyframes`
100% {
    left: 0;
    opacity: 1;
}
`;

export const Container = styled.section`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  background-color: ${({ theme }) => theme.colors.primary.light};
  margin: 64px 24px 0 24px;
  max-height: 100vh;
  height: 100%;
  padding: 20px;

  .slider {
    display: flex;
    flex-direction: column;
    height: auto;
    margin: 0 24px;

    .slider-carousel {
      .slider-counter {
        width: inherit;
        height: 90px;
        display: block;
        margin-bottom: 20px;
        margin-left: 3px;
        position: relative;

        .slide-number {
          font-size: 100px;
          line-height: 90px;
          font-weight: 800;
        }
      }
    }

    .slider-navigator {
      display: flex;
      flex-direction: column;
      width: 100%;

      div {
        width: 20px;
        height: 1px;
        display: block;
        margin-bottom: 40px;
        margin-left: 35px;
        background-color: ${({ theme }) => theme.colors.slider};
        transition: all 0.2s ease;

        &.active-slide {
          width: 90px;
          background-color: ${({ theme }) => theme.colors.highlight};
        }

        &:last-child {
          margin-bottom: 30px;
        }
      }
    }
  }

  .slider-next-prev {
    width: 150px;
    height: 45px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary.lighter};
    border-radius: 23px;

    div {
      height: 32px;
    }

    .slides-counter {
      font-weight: 400;
      font-style: normal;
      color: ${({ theme }) => theme.colors.slider};
      line-height: 32px;

      span {
        &:nth-child(1) {
          color: ${({ theme }) => theme.colors.text.main};
        }
      }
    }

    .prev-slide,
    .next-slide {
      display: flex;
      align-items: center;
      width: 32px;
      cursor: pointer;

      img {
        width: 32px;
        height: 32px;
      }
    }
  }
  .projects {
    flex: 1;
    display: flex;
    align-items: center;
    margin: 0 50px;
    overflow: hidden;
  }

  @media only screen and (max-width: 999px) {
    flex-direction: column-reverse;
    margin: 24px 0;
    padding-top: 0;
    max-height: 100%;
    .slider {
      margin: auto;
      align-items: center;
      justify-content: center;

      .slider-carousel {
        display: flex;
        align-items: center;
        .slider-counter {
          margin: 0;
          .slide-number {
            font-size: 40px;
          }
        }
      }

      .slider-navigator {
        flex-direction: row;

        div {
          width: 1px;
          height: 20px;
          display: block;
          margin-bottom: 0px;
          margin-left: 15px;
          background-color: ${({ theme }) => theme.colors.slider};
          transition: all 0.2s ease;

          &.active-slide {
            height: 40px;
            width: 1px;
            background-color: ${({ theme }) => theme.colors.highlight};
          }

          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }

    .slider-next-prev {
      align-self: center;
      margin: auto;
    }
  }

  .projects {
    justify-content: center;
    margin: 0;
    padding: 16px 16px 0 0;
  }

  @media only screen and (min-width: 769px) and (max-width: 1366px) {
    .slider {
      .slider-navigator {
        div {
          margin-left: 15px;
        }
      }

      .slider-carousel {
        .slider-counter {
          .slide-number {
            font-size: 60px;
          }
        }
      }
    }
  }
`;

export const Project = styled.div<ProjectProps>`
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
    width: 90%;
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
    width: 100%;
    height: 100%;

    .bg-effect {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 40vw;
      width: 100%;
      height: auto;
      margin-left: 16px;
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

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    max-height: 100%;
    max-width: 90%;

    .left-section {
      margin: 16px auto;
      align-items: center;

      h1 {
        font-size: 36px;
        text-align: center;
      }
    }
    .right-section {
      .bg-effect {
        width: 80%;
        height: 80%;

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

  @media only screen and (min-width: 1000px) and (max-width: 1366px) {
    justify-content: space-between;
    flex-direction: column;

    .left-section {
      margin: 16px;
      align-items: center;

      h1 {
        font-size: 36px;
      }
    }
    .right-section {
      margin-left: 16px;

      .bg-effect {
        width: 100%;
        height: auto;
        margin-right: 32px;

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
`;
