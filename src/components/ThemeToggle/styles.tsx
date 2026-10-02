import styled from 'styled-components';

export const Container = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 35px;
  min-height: 35px;
  padding: 6px 9px;
  border-radius: 18px;
  text-align: left;
  background: ${({ theme }) => theme.colors.primary.light};
  border: 1px solid ${({ theme }) => theme.colors.primary.lighter};
  color: ${({ theme }) => theme.colors.text.main};
  font-size: 12px;
  font-weight: 700;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.light};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
