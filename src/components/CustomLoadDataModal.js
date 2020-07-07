import React from 'react';
import styled from 'styled-components';
import Loader from "react-loader-spinner";

const StyledLoadingDialog = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-direction: column;

  h1 {
    display: block;
    color: #3C763D;
  }
`;

const CustomLoadDataModal = () => (
    <StyledLoadingDialog>
      <h1>Loading Saudi layers...</h1>
      <Loader type="Oval" color="#3C763D" height={80} width={80} />
    </StyledLoadingDialog>
);

export default CustomLoadDataModal;
