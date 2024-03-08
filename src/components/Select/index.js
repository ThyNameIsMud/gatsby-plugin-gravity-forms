import clsx from "clsx";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import withConditionalLogic from "../../Hoc/withConditionalLogic";
import strings from "../../utils/strings";

const Select = ({ fieldData, name, id, ...wrapProps }) => {
  const { choices, cssClass, isRequired, size, placeholder } = fieldData;

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
      <select
        aria-invalid={Boolean(errors?.[name])}
        aria-required={isRequired}
        //TODO: GF uses select2 library and classes, need to figure out how to handle here if we're mimicing their functionality
        className={clsx(
          "gravityform__field__input",
          "gravityform__field__input__select",
          "gfield_select",
          cssClass,
          valueToLowerCase(size)
        )}
        id={id}
        name={name}
        {...register(name, {
          required: isRequired && strings.errors.required,
          shouldUnregister: true
        })}
      >
        {placeholder && (
          <option value="" disabled>
              {placeholder}
          </option>
        )}
        {choices.map(({ text, value }, index) => {
          return (
            <option
              key={`${name}-${index}`}
              value={value}
            >
              {text}
            </option>
          );
        })}
      </select>
    </InputWrapper>
  );
};

export default withConditionalLogic(Select);

Select.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
  }),
  register: PropTypes.func,
  id: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const SelectField = graphql`
  fragment SelectField on WpSelectField {
    adminLabel
    autocompleteAttribute
    canPrepopulate
    choices {
      ... on WpSelectFieldChoice {
        isSelected
        text
        value
      }
    }
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    defaultValue
    description
    descriptionPlacement
    errorMessage
    hasAutocomplete
    hasChoiceValue
    hasEnhancedUI
    inputName
    isRequired
    label
    labelPlacement
    placeholder
    shouldAllowDuplicates
    size
    value
  }
`;
