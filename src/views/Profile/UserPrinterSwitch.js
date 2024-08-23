import React from 'react';
import { Switch, FormControlLabel, Typography } from '@mui/material';
import './UserPrinterSwitch.css';

export default function UserPrinterSwitch({ checked, onChange }) {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={onChange}
            className="custom-switch"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        }
        label={
          <Typography className="label">
            Become a {checked ? 'Printer' : 'User'}
          </Typography>
        }
        labelPlacement="end" /* Position label to the right of the switch */
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }} /* Align text and switch side by side */
      />
    );
  }