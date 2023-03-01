import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React from "react";
import { cloneDeep } from "lodash";
import { useFormContext, useWatch } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";

const Email = ({ defaultValue, fieldData, name, ...wrapProps }) => {
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
                labelFor={name}
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
                    defaultValue={defaultValue}
                    id={name}
                    maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                    name={name}
                    placeholder={placeholder}
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
                    })}
                    type={valueToLowerCase(inputType)}
                />
            </InputWrapper>
            {hasEmailConfirmation ?
            <InputWrapper
                errors={errors?.[`${name}_confirmation`] || {}}
                inputData={confirmFieldData}
                labelFor={`${name}_confirmation`}
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
                    id={name}
                    maxLength={maxLength || 524288} // 524288 = 512kb, avoids invalid prop type error if maxLength is undefined.
                    name={`${name}_confirmation`}
                    placeholder={placeholder}
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
                    })}
                    type={valueToLowerCase(inputType)}
                />
            </InputWrapper>
            : null}
        </>
    );
};

export default Email;

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
      autocompleteAttribute
      customLabel
      defaultValue
      id
      label
      customLabel
      name
      placeholder
    }
    isRequired
    label
    placeholder
    shouldAllowDuplicates
    size
    subLabelPlacement
    value
  }
`;
