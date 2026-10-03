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

  /* Scrolled: a solid bar in the page color, as tall as the shortened logo tab (90px, which is also
     the anchor scroll offset), so links never sit on top of the content behind them. */
  ${({ 'data-isscrolled': isScrolled, theme }) =>
    isScrolled === true &&
    css`
      height: 90px;
      background: ${theme.colors.background};
      box-shadow: 0 1px 0 ${theme.colors.hairline};
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

  .header-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    position: absolute;
    top: 36px;
    /* The grey panels end 40px from the window edge: this keeps a 4px gap to their border. */
    right: 44px;

    /* On phones the main menu collapses into the hamburger, but the language switcher stays in the
       bar, just left of the menu button (54px wide, 30px from the edge). The theme toggle moves
       into the menu, where there is room for it. */
    @media only screen and (max-width: 635px) {
      top: 40px;
      right: 96px;

      .header-theme {
        display: none;
      }
    }

    /* Very narrow phones: tighter buttons so the switcher clears the logo. */
    @media only screen and (max-width: 360px) {
      [role='group'] button {
        min-width: 32px;
        padding: 6px 8px;
      }
    }
  }
`;

export const Menu = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  float: left;
  height: 110px;
  max-width: 300px;
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
      color: ${({ theme }) => theme.colors.accent};
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
