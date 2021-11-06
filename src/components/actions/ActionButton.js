import React from 'react'
import { Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';



export default function ActionButton(props) {
    const {onClick} = props;

    return (
        <Button
        onClick = {onClick}
        color="error"
        variant="outlined"
        size="small">
            <CloseIcon />
        </Button>
    )
}