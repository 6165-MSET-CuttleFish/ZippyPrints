import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'
import Controls from "./actions/Controls";
import {makeStyles} from '@mui/styles'
import Slide from '@mui/styled-engine';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: '2px',
        position: 'absolute',
        top: -100,
    },
    root: {
        left: 100
    }
}))


export default function Popup(props) {

    const{ title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();
    
    return(
        <Dialog open = {openPopup} maxWidth="md" classes={{ paper: classes.dialogWrapper}}>
            <DialogTitle classes = {classes.root}>

                <div style = {{display: 'flex'}}>
                    <Typography variant="h6" component="div" style={{flexGrow: 12}}>
                        {title}
                    </Typography>
           
            <Controls.ActionButton 
            onClick={() => {setOpenPopup(false)}}>
            </Controls.ActionButton>
            </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    )
}
