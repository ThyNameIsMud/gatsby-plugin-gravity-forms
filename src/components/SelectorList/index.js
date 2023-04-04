import clsx from "clsx";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import InputWrapper from "../InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

// TODO: Enable Select All Choice
const SelectorList = ({ fieldData, name, ...wrapProps }) => {
  const {
    choices,
    cssClass,
    isRequired,
    size,
    type: typeUpper
  } = fieldData;

  const type = valueToLowerCase(typeUpper);

  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name]}
      inputData={fieldData}
      labelFor={name}
      {...wrapProps}
    >
      <ul className={`gfield_${type}`} id={name}>
        {choices.map(({ isSelected, text, value }, index) => {
          const choiceID = index + 1;
          return (
            <li key={`${name}-${index + 1}`}>
              <input
                className={clsx(
                  `gravityform__field__input__${type}`,
                  `gravityform__field__input__${type}--` + choiceID,
                  cssClass,
                  valueToLowerCase(size)
                )}
                defaultChecked={isSelected}
                id={`${name}_${choiceID}`}
                name={name}
                {...register(
                  name,
                  {
                    required: isRequired && strings.errors.required,
                    shouldUnregister: true
                  }
                )}
                type={type}
                value={value}
              />
              &nbsp;
              <label
                htmlFor={`${name}_${choiceID}`}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </li>
          );
        })}
      </ul>
    </InputWrapper>
  );
};

export default withConditionalLogic(SelectorList);

SelectorList.propTypes = {
  fieldData: PropTypes.shape({
    choices: PropTypes.array,
    cssClass: PropTypes.string,
    id: PropTypes.number,
    isRequired: PropTypes.bool,
    size: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const CheckboxField = graphql`
  fragment CheckboxField on WpCheckboxField {
    adminLabel
    canPrepopulate
    choices {
      ... on WpCheckboxFieldChoice {
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
    errorMessage
    hasChoiceValue
    hasSelectAll
    inputs {
      ... on WpCheckboxInputProperty {
        id
        label
        name
      }
    }
    inputName
    isRequired
    label
    labelPlacement
  }
`;

export const RadioField = graphql`
  fragment RadioField on WpRadioField {
    adminLabel
    canPrepopulate
    choices {
      ... on WpRadioFieldChoice {
        isOtherChoice
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
    hasOtherChoice
    errorMessage
    inputName
    isRequired
    label
    labelPlacement
    shouldAllowDuplicates
    value
  }
`;
