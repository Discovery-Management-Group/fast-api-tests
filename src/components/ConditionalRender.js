import React from 'react';

export const ConditionalRender = (props) =>{
    if(props.renderCondition) {
        return (props.children)
    }else{
        return null
    }
}