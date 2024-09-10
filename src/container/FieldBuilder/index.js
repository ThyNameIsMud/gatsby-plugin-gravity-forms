import clsx from "clsx";
import React from "react";

import Captcha from "../../components/Captcha";
import Html from "../../components/Html";
import Input from "../../components/Input";
import Phone from "../../components/Phone";
import Multiselect from "../../components/Multiselect";
import Select from "../../components/Select";
import SelectorList from "../../components/SelectorList";
import Textarea from "../../components/Textarea";
import FileUpload from "../../components/FileUpload";
import Email from "../../components/Email";
import { valueToLowerCase } from "../../utils/helpers";
import { islabelHidden } from "../../utils/inputSettings";
import Time from "gatsby-plugin-gravity-forms/src/components/Time";

const FieldBuilder = ({
  databaseId,
  formFields,
  formLoading,
  preOnSubmit,
  settings,
}) => {
  // Loop through fields and create
  return formFields.map((field) => {
    // Set the wrapper classes
    const {
      readonly,
      databaseId: fieldId,
      captchaTheme,
      descriptionPlacement,
      isRequired,
      subLabelPlacement,
      labelPlacement,
      type,
      size,
      visibility,
      layoutGridColumnSpan
    } = field;

    const isHiddenField = type === "HIDDEN";

    let width = 'full';
    if (layoutGridColumnSpan === 6) {
        width = 'half';
    }
    if (layoutGridColumnSpan === 4) {
        width = 'third';
    }
    if (layoutGridColumnSpan === 3) {
        width = 'quarter';
    }
    if (type === 'EMAIL' && field.hasEmailConfirmation) {
        width = 'half';
    }

    let inputWrapperClass = clsx(
      "gfield",
      "gravityform__field",
      "gravityform__field__" + valueToLowerCase(type),
      { [`gravityform__field--${valueToLowerCase(size)}`]: size },
      field.cssClass,
      { "field-required": isRequired },
      { "hidden-label": islabelHidden(labelPlacement) },
      { gfield_contains_required: isRequired },
      {
        [`field_sublabel_${valueToLowerCase(
          subLabelPlacement
        )}`]: valueToLowerCase(subLabelPlacement),
      },
      {
        [`field_description_${valueToLowerCase(
          descriptionPlacement
        )}`]: descriptionPlacement,
      },
      `gfield_visibility_${
        valueToLowerCase ? "hidden" : valueToLowerCase(visibility)
      }`,
      `gfield_${width}`
    );

    const wrapId = `field_${databaseId}_${fieldId}`;

    //TODO: Should this match GF version "input_form.id_input.id"
    const inputName = `input_${fieldId}`;
    const inputId = `input_${databaseId}_${fieldId}`;

    switch (field.type) {
      // Add note for unsupported captcha field
      case "CAPTCHA":
        return (
          <Captcha
            captchaTheme={captchaTheme}
            fieldData={field}
            gfId={fieldId}
            key={fieldId}
            name={inputName}
            preOnSubmitRef={preOnSubmit}
            settings={settings?.recaptcha}
            wrapClassName={inputWrapperClass}
          />
        );
      case "HTML":
        return (
          <Html
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      // Start with the standard fields
      case "TEXT":
      case "NUMBER":
      case "HIDDEN":
      case "DATE":
        return (
          <Input
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
            readonly={readonly}
          />
        );
      case "PHONE":
        return (
          <Phone
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
            readonly={readonly}
          />
        );
      case "EMAIL":
        return (
          <Email
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
            readonly={readonly}
          />
        );
      case "TIME":
        return (
          <Time
              fieldData={field}
              key={fieldId}
              gfId={fieldId}
              id={inputId}
              name={inputName}
              wrapClassName={inputWrapperClass}
              wrapId={wrapId}
              readonly={readonly}
          />
        );
      case "TEXTAREA":
        return (
          <Textarea
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
            readonly={readonly}
          />
        );
      case "SELECT":
        return (
          <Select
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "MULTISELECT":
        return (
          <Multiselect
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "RADIO":
      case "CHECKBOX":
        return (
          <SelectorList
            fieldData={field}
            key={fieldId}
            gfId={fieldId}
            id={inputId}
            name={inputName}
            wrapClassName={inputWrapperClass}
            wrapId={wrapId}
          />
        );
      case "FILEUPLOAD":
          return (
              <FileUpload
                  fieldData={field}
                  key={fieldId}
                  gfId={fieldId}
                  id={inputId}
                  name={inputName}
                  wrapClassName={inputWrapperClass}
                  wrapId={wrapId}
                  readonly={readonly}
              />
          )

      default:
        return null;
    }
  });
};

export default FieldBuilder;
