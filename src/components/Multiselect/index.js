import classnames from "classnames";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";

const Multiselect = ({ fieldData, defaultValue, name, ...wrapProps }) => {
  const { choices, cssClass, id, isRequired, size } = fieldData;
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const selectedOptions = choices.filter(({ isSelected, value }) => isSelected || defaultValue === value)
                            .map(({ value }) => value);

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <select
        //TODO: GF uses select2 library and classes, need to figure out how to handle here if we're mimicing their functionality
        className={classnames(
            "gravityform__field__input",
          "gravityform__field__input__select",
          "gfield_select",
          cssClass,
          valueToLowerCase(size)
        )}
        id={name}
        multiple={true}
        name={name}
        defaultValue={selectedOptions}
        {...register(name, {
          required: isRequired,
        })}
      >
        {choices.map(({ isSelected, text, value }, index) => {
          return (
            <option
              key={`${id}_${index}`}
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

export default Multiselect;

Multiselect.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    id: PropTypes.number,
    choices: PropTypes.arrayOf(PropTypes.shape({isSelected: PropTypes.bool,text: PropTypes.string,value: PropTypes.string})),
    size: PropTypes.string,
    isRequired: PropTypes.bool,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const MultiSelectField = graphql`
  fragment MultiSelectField on WpMultiSelectField {
    adminLabel
    canPrepopulate
    choices {
      isSelected
      text
      value
    }
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    hasChoiceValue
    hasEnhancedUI
    errorMessage
    inputName
    isRequired
    label
    size
    values
  }
`;
