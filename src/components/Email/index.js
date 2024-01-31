import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React from "react";
import { cloneDeep } from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const Email = ({ fieldData, name, id, readonly, ...wrapProps }) => {
    const {
        cssClass,
        inputMaskValue,
        isRequired,
        maxLength,
        placeholder,
        size,
        type,
        hasEmailConfirmation,
        inputs
    } = fieldData;

    const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;
    let inputType = type.toLowerCase();
    let confirmFieldData = cloneDeep(fieldData);
    if (hasEmailConfirmation) {
        fieldData.label = inputs[0].customLabel ?? inputs[0].label;
        confirmFieldData.label = inputs[1].customLabel ?? inputs[1].label;
    }

    const {
        register,
        formState: { errors },
    } = useFormContext();

    const emailValue = useWatch({name});

    return (
        <>
            <InputWrapper
                errors={errors?.[name] || {}}
                inputData={fieldData}
                labelFor={id}
                {...wrapProps}
            >
                <input
                    aria-invalid={Boolean(errors?.[name])}
                    aria-required={isRequired}
                    className={clsx(
                        "gravityform__field__input",
                        `gravityform__field__input__${valueToLowerCase(type)}`,
                        cssClass,
                        valueToLowerCase(size)
                    )}
                    id={id}
                    maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                    name={name}
                    placeholder={placeholder}
                    readOnly={readonly}
                    {...register(name, {
                        required: isRequired && strings.errors.required,
                        maxlength: {
                            value: maxLength > 0 && maxLength,
                            message:
                                maxLength > 0 &&
                                `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
                        },
                        pattern: {
                            value: regex,
                            message: regex && strings.errors.pattern,
                        },
                        shouldUnregister: true
                    })}
                    type={valueToLowerCase(inputType)}
                />
            </InputWrapper>
            {hasEmailConfirmation ?
            <InputWrapper
                errors={errors?.[`${name}_confirmation`] || {}}
                inputData={confirmFieldData}
                labelFor={`${id}_confirmation`}
                {...wrapProps}
            >
                <input
                    aria-invalid={Boolean(errors?.[name])}
                    aria-required={isRequired}
                    className={clsx(
                        "gravityform__field__input",
                        `gravityform__field__input__${valueToLowerCase(type)}`,
                        cssClass,
                        valueToLowerCase(size)
                    )}
                    id={`${id}_confirmation`}
                    maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                    name={`${name}_confirmation`}
                    placeholder={placeholder}
                    readOnly={readonly}
                    {...register(`${name}_confirmation`, {
                        required: isRequired && strings.errors.required,
                        maxlength: {
                            value: maxLength > 0 && maxLength,
                            message:
                                maxLength > 0 &&
                                `${strings.errors.maxChar.front}  ${maxLength} ${strings.errors.maxChar.back}`,
                        },
                        pattern: {
                            value: regex,
                            message: regex && strings.errors.pattern,
                        },
                        validate: {
                            matchEmails: value => (value === emailValue) || 'Emails must match.',
                        },
                        shouldUnregister: true
                    })}
                    type={valueToLowerCase(inputType)}
                />
            </InputWrapper>
            : null}
        </>
    );
};

export default withConditionalLogic(Email);

Email.propTypes = {
    fieldData: PropTypes.shape({
        cssClass: PropTypes.string,
        inputMaskValue: PropTypes.string,
        isRequired: PropTypes.bool,
        maxLength: PropTypes.number,
        placeholder: PropTypes.string,
        size: PropTypes.string,
        type: PropTypes.string,
        hasEmailConfirmation: PropTypes.bool,
        inputs: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            customLabel: PropTypes.string
        }))
    }),
    name: PropTypes.string,
    readonly: PropTypes.bool,
    value: PropTypes.string,
    wrapProps: PropTypes.object,
    id: PropTypes.string
}

export const EmailField = graphql`
  fragment EmailField on WpEmailField {
    adminLabel
    canPrepopulate
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    hasEmailConfirmation
    inputs {
        ... on WpEmailInputProperty {
            autocompleteAttribute
            customLabel
            defaultValue
            id
            label
            customLabel
            name
            placeholder
        }
    }
    isRequired
    label
    labelPlacement
    placeholder
    shouldAllowDuplicates
    size
    subLabelPlacement
    value
  }
`;
