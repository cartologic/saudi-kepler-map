import React from 'react';
import styled from 'styled-components';
import LoadingData from './LoadingData';

const StyledSpinner = styled.div`
  text-align: center;

  span {
    margin: 0 auto;
  }
`;

const StyledLoadingDialog = styled.div.attrs({
  className: 'data-loading-dialog'
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  .loading-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const LoadingDialog = ({size = 64}) => (
  <StyledLoadingDialog>
    <div className="loading-content">
      <StyledSpinner>
        <h1>Loading Saudi layers...</h1>
        <LoadingData size={size} />
      </StyledSpinner>
    </div>
  </StyledLoadingDialog>
);

export default LoadingDialog;
