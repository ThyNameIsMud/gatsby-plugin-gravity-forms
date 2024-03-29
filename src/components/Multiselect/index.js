import clsx from "clsx";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import withConditionalLogic from "../../Hoc/withConditionalLogic";
import strings from "../../utils/strings";

const Multiselect = ({ fieldData, name, id, ...wrapProps }) => {
  const { choices, cssClass, isRequired, size } = fieldData;
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
        //TODO: GF uses select2 library and classes, need to figure out how to handle here if we're mimicing their functionality
        className={clsx(
            "gravityform__field__input",
          "gravityform__field__input__select",
          "gfield_select",
          cssClass,
          valueToLowerCase(size)
        )}
        aria-invalid={Boolean(errors?.[name])}
        id={id}
        multiple={true}
        name={name}
        {...register(name, {
          required: isRequired && strings.errors.required,
          shouldUnregister: true
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
export default withConditionalLogic(Multiselect);

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
  id: PropTypes.string
};

export const MultiSelectField = graphql`
  fragment MultiSelectField on WpMultiSelectField {
    adminLabel
    canPrepopulate
    choices {
      ... on WpMultiSelectFieldChoice {
        isSelected
        text
        value
      }
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
    labelPlacement
    size
    values
  }
`;
