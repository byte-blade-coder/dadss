import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'


export const ButtonWrapper = styled(Button)`
  border: 1px solid #012169 !important;
  outline: none;
  background-color: #012169;
  border-radius: 5px;
  color: #fff !important;
  width: 100%;
  &:hover,
  &:focus {
    background-color: #fff !important;
    color: #012169 !important;
  }
`;

