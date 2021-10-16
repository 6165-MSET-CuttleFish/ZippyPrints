import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {TextField, Checkbox, FormControlLabel, FormControl, Select, InputLabel, FormHelperText, Radio, RadioGroup } from '@mui/material'

const auth = getAuth();

const validate = values => {
    const errors = {}
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'favoriteColor',
      'notes'
    ]
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required'
      }
    })
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address'
    }
    return errors
  }
  
  const renderTextField = ({
    label,
    input,
    meta: { touched, invalid, error },
    ...custom
  }) => (
    <TextField
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
    />
  )
  
  const renderCheckbox = ({ input, label }) => (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={input.value ? true : false}
            onChange={input.onChange}
          />
        }
        label={label}
      />
    </div>
  )
  
  const radioButton = ({ input, ...rest }) => (
    <FormControl>
      <RadioGroup {...input} {...rest}>
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
      </RadioGroup>
    </FormControl>
  )
  
  const renderFromHelper = ({ touched, error }) => {
    if (!(touched && error)) {
      return
    } else {
      return <FormHelperText>{touched && error}</FormHelperText>
    }
  }
  
  const renderSelectField = ({
    input,
    label,
    meta: { touched, error },
    children,
    ...custom
  }) => (
    <FormControl error={touched && error}>
      <InputLabel htmlFor="age-native-simple">Age</InputLabel>
      <Select
        native
        {...input}
        {...custom}
        inputProps={{
          name: 'age',
          id: 'age-native-simple'
        }}
      >
        {children}
      </Select>
      {renderFromHelper({ touched, error })}
    </FormControl>
  )
  
  const MaterialUiForm = props => {
    const { handleSubmit, pristine, reset, submitting, classes } = props
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <Field
            name="firstName"
            component={renderTextField}
            label="First Name"
          />
        </div>
        <div>
          <Field name="lastName" component={renderTextField} label="Last Name" />
        </div>
        <div>
          <Field name="email" component={renderTextField} label="Email" />
        </div>
        <div>
          <Field name="sex" component={radioButton}>
            <Radio value="male" label="male" />
            <Radio value="female" label="female" />
          </Field>
        </div>
        <div>
          <Field
            classes={classes}
            name="favoriteColor"
            component={renderSelectField}
            label="Favorite Color"
          >
            <option value="" />
            <option value={'ff0000'}>Red</option>
            <option value={'00ff00'}>Green</option>
            <option value={'0000ff'}>Blue</option>
          </Field>
        </div>
        <div>
          <Field name="employed" component={renderCheckbox} label="Employed" />
        </div>
        <div />
        <div>
          <Field
            name="notes"
            component={renderTextField}
            label="Notes"
            multiline
            rowsMax="4"
            margin="normal"
          />
        </div>
        <div>
          <button type="submit" disabled={pristine || submitting}>
            Submit
          </button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </div>
      </form>
    )
  }
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const asyncValidate = (values /*, dispatch */) => {
    return sleep(1000).then(() => {
        // simulate server latency
        if (['foo@foo.com', 'bar@bar.com'].includes(values.email)) {
        // eslint-disable-next-line no-throw-literal
        throw { email: 'Email already Exists' }
        }
    })
    }
  
  export default reduxForm({
    form: 'MaterialUiForm', // a unique identifier for this form
    validate,
    asyncValidate
  })(MaterialUiForm)