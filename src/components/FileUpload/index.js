import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React from "react";
import { useFormContext } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const FileUpload = ({ fieldData, name, readonly, ...wrapProps }) => {
    const {
        cssClass,
        isRequired,
        size,
        allowedExtensions,
        canAcceptMultipleFiles
    } = fieldData;

    const {
        register,
        formState: { errors }
    } = useFormContext();

    return (
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
                    `gravityform__field__input__fileupload`,
                    cssClass,
                    valueToLowerCase(size))}
                id={name}
                name={name}
                accept={allowedExtensions?.join(',')}
                type='file'
                multiple={canAcceptMultipleFiles}
                readOnly={readonly}
                {...register(name, {
                    required: isRequired && strings.errors.required,
                    shouldUnregister: true
                })}
            />
        </InputWrapper>
    )
};

export default withConditionalLogic(FileUpload);

FileUpload.propTypes = {
    fieldData: PropTypes.shape({
        cssClass: PropTypes.string,
        isRequired: PropTypes.bool,
        type: PropTypes.string,
        size: PropTypes.string,
        allowedExtensions: PropTypes.arrayOf(PropTypes.string),
        maxFileSize: PropTypes.number
    }),
    value: PropTypes.string,
    name: PropTypes.string,
    wrapProps: PropTypes.object,
    readonly: PropTypes.bool
};

export const FileField = graphql`
  fragment FileField on WpFileUploadField {
    adminLabel
    conditionalLogic {
      ...ConditionalLogic
    }
    cssClass
    description
    descriptionPlacement
    errorMessage
    isRequired
    label
    labelPlacement
    maxFileSize
    maxFiles
    allowedExtensions
    canAcceptMultipleFiles
    value
  }
`;
