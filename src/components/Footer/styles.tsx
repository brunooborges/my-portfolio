import styled from 'styled-components';

export const Container = styled.footer`
  height: 100%;
  max-height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 32px 0;

  p {
    color: ${({ theme }) => theme.colors.text.main};
    font-size: 14px;
  }
`;
