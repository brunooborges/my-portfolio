import styled from 'styled-components';

export const Section = styled.section`
  margin-bottom: 48px;
`;

export const Showcase = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: stretch;
  background-color: ${({ theme }) => theme.colors.primary.light};
  border-radius: 16px;
  margin: 64px 24px 0 24px;
  min-height: 70vh;
  padding: 20px;

  .slider {
    display: flex;
    flex-direction: column;
    margin: 0 24px;

    .slider-carousel {
      height: 60vh;

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
      max-height: 40vh;
      justify-content: space-around;

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

    .slides-counter {
      font-weight: 400;
      font-style: normal;
      color: ${({ theme }) => theme.colors.text.main};
      line-height: 32px;

      span:nth-child(1) {
        color: ${({ theme }) => theme.colors.text.light};
      }
    }

    .prev-slide,
    .next-slide {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: transparent;
      cursor: pointer;

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.accent};
        outline-offset: 2px;
      }

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
    justify-content: center;
    margin: 0;
  }

  @media only screen and (max-width: 767px) {
    flex-direction: column-reverse;
    margin: 24px auto 0;
    min-height: 0;
    padding: 16px;

    .slider {
      margin: auto;
      align-items: center;
      justify-content: center;

      .slider-carousel {
        display: flex;
        align-items: center;
        height: 100%;

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

          &.active-slide {
            height: 40px;
            width: 1px;
          }

          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }

    .slider-next-prev {
      align-self: center;
      margin: 16px auto 0;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 1366px) {
    margin: 24px;
    min-height: 0;

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

export const Experiments = styled.section`
  margin: 32px 24px 0;
  padding: 0 24px;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.main};
    margin-bottom: 16px;
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 6px 12px;
    padding: 12px 16px;
    background: ${({ theme }) => theme.colors.primary.light};
    border-left: 3px solid ${({ theme }) => theme.colors.slider};
    transition: border-color 0.2s ease;

    &:hover,
    &:focus-within {
      border-left-color: ${({ theme }) => theme.colors.accent};
    }
  }

  .name {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.light};
  }

  .links {
    display: flex;
    flex-shrink: 0;
    gap: 12px;

    a {
      white-space: nowrap;
      font-size: 13px;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.text.main};
      text-decoration: underline;
      text-underline-offset: 3px;

      &:hover {
        color: ${({ theme }) => theme.colors.text.light};
      }

      &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.accent};
        outline-offset: 2px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    margin: 24px 16px 0;
    padding: 0 8px;
  }
`;
