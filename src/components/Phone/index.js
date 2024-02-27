import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React, { forwardRef, createRef } from "react";
import { IMaskInput } from 'react-imask';
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const standardRegexPattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/

const MaskedInput = forwardRef((props, inputRef) => {
  const { onChange, mask, name, setValue, ...rest } = props;
  const ref = createRef();

  return (
    <IMaskInput
        {...rest}
        name={name}
        inputRef={inputRef}
        ref={ref}
        mask={mask}
        onAccept={(value) => {
          setValue(name, value);
        }}
    />
  );
});

const Phone = ({ fieldData, name, id, readonly, ...wrapProps }) => {
  const {
    cssClass,
    phoneFormat,
    isRequired,
    maxLength,
    placeholder,
    size,
  } = fieldData;

  const hasPhoneFormat = phoneFormat === 'STANDARD';

  const {
    register,
    formState: { errors },
    setValue
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={id}
      {...wrapProps}
    >
      {hasPhoneFormat ?
          <MaskedInput
              aria-invalid={Boolean(errors?.[name])}
              aria-required={isRequired}
              className={clsx(
                  "gravityform__field__input",
                  `gravityform__field__input__phone`,
                  cssClass,
                  valueToLowerCase(size)
              )}
              id={id}
              name={name}
              placeholder={placeholder}
              readOnly={readonly}
              mask="(000) 000-0000"
              setValue={setValue}
              {...register(name, {
                required: isRequired && strings.errors.required,
                pattern: {
                  value: standardRegexPattern,
                  message: strings.errors.pattern,
                },
                shouldUnregister: true
              })}
          /> :
          <input
              aria-invalid={Boolean(errors?.[name])}
              aria-required={isRequired}
              className={clsx(
                  "gravityform__field__input",
                  `gravityform__field__input__phone`,
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
                shouldUnregister: true
              })}
              type="tel"
          />
      }
    </InputWrapper>
  );
};

export default withConditionalLogic(Phone);

Phone.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    phoneFormat: PropTypes.string,
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
