import React from 'react';
import styled, {keyframes} from 'styled-components';

const animationName = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.span`
    border-left-color: ${props => props.color || props.theme.primaryBtnBgd};
    animation: _preloader_spin_ 500ms linear infinite;
    border-radius: 50%;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-right-color: transparent;
    cursor: wait;
    border-style: solid;
    display: block;
    animation-name: ${animationName};
}`;

const LoadingWrapper = styled.div`
  border-radius: 50%;
  border: 3px solid ${props => props.borderColor || props.theme.borderColorLT};
  padding: 2px;
`;

const wrapperStyle = {
    height:"100px", 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center'
};

const LoadingData = ({size = 32, color, strokeWidth = 3, gap = 2}) => (
    <div style={wrapperStyle}>
        <LoadingWrapper style={{width: `${size}px`, height: `${size}px`, padding: `${gap}px`}}>
            <Loader
                color={color}
                style={{
                    width: `${size - strokeWidth * 2 - gap * 2}px`,
                    height: `${size - strokeWidth * 2 - gap * 2}px`
                }}
            />
        </LoadingWrapper>
    </div>
);

export default LoadingData;
