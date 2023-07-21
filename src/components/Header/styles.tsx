import styled, { css, keyframes } from 'styled-components';

interface ContainerProps {
  'data-isscrolled'?: boolean;
}

const logoBigger = keyframes`
0% {
  top: -40px;
}
100% {
  top: 0;
}
`;

const logoShorten = keyframes`
0% {
  top: 0px;
}
100% {
  top: -40px;
}
`;

const headerBackground = keyframes`
0% {
    background: transparent;
}
100% {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 100% );
}
`;

export const Container = styled.header<ContainerProps>`
  width: 100%;
  height: 100%;
  max-height: 130px;
  display: block;
  background: transparent;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 900;
  transition: all 0.2s ease-out;

  ${({ 'data-isscrolled': isScrolled }) =>
    isScrolled === true &&
    css`
      animation: ${headerBackground} 0.2s ease-out forwards;
    `};

  .logo {
    width: 75px;
    height: 130px;
    float: left;
    margin-left: 60px;
    background-color: ${({ theme }) => theme.colors.highlight};
    border-radius: 0 0 37px 37px;
    transition: all 0.2s ease-out;
    position: relative;

    img {
      width: 101px;
      height: 50px;
      display: block;
      margin: 55px 0 0 0;
    }

    ${({ 'data-isscrolled': isScrolled }) =>
      isScrolled === true &&
      css`
        animation: ${logoShorten} 0.2s ease-out forwards;
      `};

    ${({ 'data-isscrolled': isScrolled }) =>
      isScrolled === false &&
      css`
        animation: ${logoBigger} 0.2s ease-out forwards;
      `};
  }
`;

export const Menu = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  float: left;
  height: 110px;
  max-width: 260px;
  width: 100%;
  margin-left: 30px;

  a {
    position: relative;
    display: inline-block;
    text-decoration: none;
    padding-bottom: 6px;
    color: ${({ theme }) => theme.colors.text.main};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.highlight};
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 4px;
      background-color: ${({ theme }) => theme.colors.highlight};
      transition: all 0.2s ease-out;
    }

    &:hover::after {
      width: 100%;
    }
  }

  @media only screen and (max-width: 635px) {
    display: none;
  }
`;
