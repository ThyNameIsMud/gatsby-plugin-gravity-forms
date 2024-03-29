import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const standardType = (type) => {
  switch (type) {
    case "phone":
      return "tel";
    case "fileupload":
      return "file";
    default:
      return type;
  }
};

const Input = ({ fieldData, name, id, readonly, ...wrapProps }) => {
  const {
    cssClass,
    inputMaskValue,
    isRequired,
    maxLength,
    placeholder,
    size,
    type,
  } = fieldData;

  const regex = inputMaskValue ? new RegExp(inputMaskValue) : false;
  let inputType = standardType(type.toLowerCase());

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
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
  );
};

export default withConditionalLogic(Input);

Input.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    inputMaskValue: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    isRequired: PropTypes.bool,
    type: PropTypes.string,
    size: PropTypes.string,
  }),
  value: PropTypes.string,
  name: PropTypes.string,
  wrapProps: PropTypes.object,
  readonly: PropTypes.bool,
  id: PropTypes.string,
};

export const TextField = graphql`
  fragment TextField on WpTextField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isPasswordInput
    isRequired
    label
    labelPlacement
    maxLength
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;

export const DateField = graphql`
  fragment DateField on WpDateField {
    adminLabel
    calendarIconType
    calendarIconUrl
    canPrepopulate
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    dateFormat
    dateType
    defaultValue
    description
    descriptionPlacement
    errorMessage
    inputName
    inputs {
      ... on WpDateInputProperty {
        customLabel
        defaultValue
        id
        label
        placeholder
      }
    }
    isRequired
    label
    labelPlacement
    placeholder
    shouldAllowDuplicates
    subLabelPlacement
    value
  }
`;

export const HiddenField = graphql`
  fragment HiddenField on WpHiddenField {
    canPrepopulate
    defaultValue
    inputName
    label
    value
  }
`;

export const NumberField = graphql`
  fragment NumberField on WpNumberField {
    adminLabel
    autocompleteAttribute
    calculationFormula
    calculationRounding
    canPrepopulate
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isCalculation
    isRequired
    label
    labelPlacement
    numberFormat
    placeholder
    rangeMax
    rangeMin
    shouldAllowDuplicates
    size
    value
  }
`;

export const PhoneField = graphql`
  fragment PhoneField on WpPhoneField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    inputName
    isRequired
    label
    labelPlacement
    phoneFormat
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;
