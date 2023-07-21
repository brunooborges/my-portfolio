import { css, styled } from 'styled-components';

interface ContainerProps {
  'data-isopen'?: boolean;
}

export const MenuMobile = styled.div`
  button {
    display: none;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: none;
    background-color: ${({ theme }) => theme.colors.highlight};
    color: ${({ theme }) => theme.colors.primary.dark};
    position: relative;
    float: right;
    right: 30px;
    top: 30px;
    z-index: 9999;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
    }

    @media only screen and (max-width: 635px) {
      display: block;
    }
  }

  nav {
    display: block;
  }
`;

export const SideBar = styled.div<ContainerProps>`
  display: none;
  padding: 10px;
  border-top-left-radius: 5px;
  max-width: 240px;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  padding: 100px 30px 30px;
  transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

  @media only screen and (max-width: 635px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    right: ${({ 'data-isopen': isOpen }) => (isOpen ? '0' : '-240px')};
  }

  a {
    position: relative;
    display: inline-block;
    text-decoration: none;
    margin-bottom: 16px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.light};
    cursor: pointer;

    &:first-child {
      margin-top: 16px;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.highlight};
    }
  }
`;

export const Overlay = styled.div<ContainerProps>`
  display: none;

  ${({ 'data-isopen': isOpen }) =>
    isOpen !== null &&
    isOpen &&
    css`
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(65, 105, 225, 0.95);
      z-index: 9999;
    `};
`;
