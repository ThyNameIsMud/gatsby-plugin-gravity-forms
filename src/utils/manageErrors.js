/**
 * Loop through object of errors passed back by Gravity Forms
 * Set errors to the corrosponding input
 */

export const handleGravityFormsValidationErrors = (data, setError) => {
    data.forEach(({ id, message } ) => {
        const fieldId = `input_${id}`
        setError(fieldId, { type: 'gf_validation', message });
    });
}
