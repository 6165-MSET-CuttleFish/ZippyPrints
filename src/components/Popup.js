import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material'
import Controls from "./actions/Controls";
import {makeStyles} from '@mui/styles'
import TextField from '@mui/material/TextField';
import DialogContentText from '@mui/material/DialogContentText';

const useStyles = makeStyles(theme => ({
    dialogWrapper: {
        padding: '2px',
        position: 'absolute',
        top: 0,
        minHeight: '80vh',
        maxHeight: '80vh',
    },
    root: {
        left: 100
    }
}))


export default function Popup(props) {

    const{ title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();
    
    return(
        <Dialog open = {openPopup} classes={{ paper: classes.dialogWrapper}}onClose={() => {setOpenPopup(false)}}>
            <DialogContent dividers>
            <div style = {{display: 'flex'}}>
           <DialogContentText>

                                <Typography variant="h6" component="div" style={{flexGrow: 12}}>
                                    {title}
                                </Typography>
           </DialogContentText>

                        <Controls.ActionButton
                        onClick={() => {setOpenPopup(false)}}>
                        </Controls.ActionButton>
 </div>

                {children}
            </DialogContent>
        </Dialog>
    )
}
