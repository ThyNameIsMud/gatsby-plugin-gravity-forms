import React from 'react'
import strings from '../../utils/strings'

const FormGeneralError = props => {
    let errorMessage = ''

    if (props.errorCode === 'formHasError') {
        errorMessage = strings.errors.general
    }

    if (props.errorCode === 'unknownError') {
        errorMessage = strings.errors.unknownError
    }

    if (props.errorCode === 'leastOneField') {
        errorMessage = strings.errors.leastOneField
    }

    if (errorMessage) {
        return (
            <div className="gravityform__error_inform validation_error" aria-labelledby="gform_general_error" role="alert">
                <p id="gform_general_error">{errorMessage}</p>
            </div>
        )
    } else {
        return false
    }
}

export default FormGeneralError
