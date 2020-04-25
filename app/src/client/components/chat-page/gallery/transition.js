import React from 'react';
import { Fade } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Fade ref={ref} {...props} />;
});


export default Transition