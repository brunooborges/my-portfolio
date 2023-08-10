import { keyframes, styled } from 'styled-components';

const scaleUp = keyframes`
100% {
  transform: scale(1);
}
`;

export const Container = styled.div`
  .image-background {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 99999;

    img {
      width: 50vw;
      height: auto;
      transform: scale(0);
      animation: ${scaleUp} 0.5s 0.3s forwards cubic-bezier(0, 1.01, 0.32, 1);
    }
  }

  .closer {
    position: fixed;
    top: 50px;
    right: 100px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    color: #fff;
    font-size: 60px;
    z-index: 99999;
  }

  @media only screen and (max-width: 1260px) {
    .image-background {
      img {
        width: 85vw;
        height: auto;
      }
    }
  }
`;
