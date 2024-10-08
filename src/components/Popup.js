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
        minHeight: '0vh',
        maxHeight: '80vh',
        width: 405,
    },
    root: {
        left: 100    }
}))


export default function Popup(props) {

    const{ title, children, openPopup, setOpenPopup } = props;
    const classes = useStyles();
    
    return(
        <Dialog open = {openPopup} classes={{ paper: classes.dialogWrapper}} onClose={() => {setOpenPopup(false)}}>
            <DialogContent dividers sx={{backgroundColor: '#F2F2F2'}}> 
            <div style = {{display: 'flex'}}>
           <DialogContentText>
               <Typography variant="h6" component="div" style={{flexGrow: 12, width: 300}}>
                   {title}
                </Typography>
           </DialogContentText>
           <div style = {{display: 'flex', paddingLeft:0}}>
           <Controls.ActionButton
           onClick={() => {setOpenPopup(false)}}>
           </Controls.ActionButton>
           </div>
           </div>
           {children}
           <div style = {{display: 'flex', paddingBottom:15}}>
            </div >
            </DialogContent>
        </Dialog>
    )
}
