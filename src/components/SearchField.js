import React from 'react'
import { 
  Label, Input, FormGroup
} from 'reactstrap'

function SearchField({
  label,
  mode,
  value,
  options = [],
  onChangeField,
  containerStyle
}) {
  return (
    <>
      <FormGroup
        style={{ ... containerStyle }}
      >
        <Label style={{ color: mode === 'light' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)' }}>
          { label }
        </Label>
        <Input
          type={ 'select' }
          value={ value }
          className={ 'w-100' }
          style={{ 
            background: 'rgba(255, 255, 255, 0.2)',
            color: mode === 'light' ? 'rgb(0,0,0)': 'rgb(255,255,255)'
          }}
          onChange={ e => onChangeField( e.target.value )}
        >
          <option value=""></option>
          {
            options.map(( optionChild, optionIndex ) => (
              <option key={ `${ optionChild }_${ optionIndex }` } value={ optionChild }>
                { optionChild }
              </option>
            ))
          }
        </Input>
      </FormGroup>
    </>
  )
}

export default SearchField