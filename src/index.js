import clsx from "clsx";
import PropTypes from "prop-types";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { keys, find, reduce, map } from "lodash";
import { graphql, navigate } from "gatsby";
import { useMutation } from "@apollo/client";
import { useForm, FormProvider } from "react-hook-form";
import FormGeneralError from "./components/FormGeneralError";
import SubmitButton from "./components/SubmitButton";
import FieldBuilder from "./container/FieldBuilder";
import {
  handleGravityFormsValidationErrors,
  // manageMainFormError,
} from "./utils/manageErrors";
import {
  submissionHasOneFieldEntry,
  cleanGroupedFields,
} from "./utils/manageFormData";
import submitMutation from "./submitMutation";
import formatPayload from "./utils/formatPayload";
import {getMatchesConditionalLogic, valueToLowerCase} from "./utils/helpers";

/**
 * Component to take Gravity Form graphQL data and turn into
 * a fully functional form.
 * @param {mixed} data Form dataset from graphQL
 */
const GravityFormForm = ({
  data,
  presetValues,
  successCallback,
  errorCallback,
  validationCallback
}) => {
  const preOnSubmit = useRef();

  // Split out data depending on how it is passed in.
  const form = data?.wpGfForm || data;

  // Deconstruct global settings (if provided).
  const settings = data?.wp?.gfSettings || {};

  const {
    submitButton,
    confirmations,
    databaseId,
    description,
    descriptionPlacement,
    formFields,
    labelPlacement,
    subLabelPlacement,
    title,
  } = form;

  const [submitForm, { data: submittionData, loading }] = useMutation(
    submitMutation
  );

  const hasBeenSubmitted = Boolean(submittionData?.submitGfForm);
  const haveFieldErrors = Boolean(submittionData?.submitGfForm?.errors?.length);

  const wasSuccessfullySubmitted = hasBeenSubmitted && !haveFieldErrors;

  const defaultValues = useMemo(() =>
      reduce(formFields?.nodes, (result, { databaseId, defaultValue, type, placeholder }) => {
        const inputName = `input_${databaseId}`;
        if (presetValues[inputName]) {
          result[inputName] = presetValues[inputName];
        } else if (defaultValue) {
            result[inputName] = defaultValue;
        } else if (type === 'SELECT' && placeholder) {
          result[inputName] = "";
        } else {
          result[inputName] = null;
        }
        return result;
      }, {}), [formFields, presetValues]);

  // Pull in form functions
  const methods = useForm({
    defaultValues
  });
  const {
    handleSubmit,
    setError,
    reset,
    getValues,
    formState: { errors },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (errors && keys(errors).length) {
      const errorsWithLabels = reduce(errors, (result, error, inputName) => {
        result[inputName] = error;
        const field = find(formFields.nodes, (field) => inputName === `input_${field.databaseId}`);
        // Send field label with errors for more useful error updates
        if (field) {
          result[inputName].label = field.label;
        }
        return result;
      }, {});
      validationCallback(errorsWithLabels);
    }
  }, [errors, formFields])

  const onSubmitCallback = async () => {
    // Make sure we are not already waiting for a response
    if (!loading) {
      // Clean error

      await preOnSubmit?.current?.recaptcha();

      const values = getValues();

      // Check that at least one field has been filled in
      if (submissionHasOneFieldEntry(values)) {
        setGeneralError("");

        const formRes = formatPayload({
          serverData: formFields?.nodes,
          clientData: values,
        });

        submitForm({
          variables: {
            databaseId,
            clientMutationId: `gf-submission-${Date.now()}`,
            fieldValues: formRes,
          },
        })
          .then(({ data: { submitGfForm: { errors, confirmation } } }) => {
            // Success if no errors returned.
            if (!Boolean(errors?.length)) {
              successCallback({
                confirmation,
                data: formRes,
                reset,
              });
            } else {
              handleGravityFormsValidationErrors(errors, setError);
              errorCallback({
                data: formRes,
                error: errors,
                reset,
              });
            }
          })
          .catch((error) => {
            setGeneralError("unknownError");
            errorCallback({ data: formRes, error, reset });
          });
      } else {
        setGeneralError("leastOneField");
      }
    }
  };

  if (wasSuccessfullySubmitted) {
    const confirmation = confirmations?.find((el) => {
      // First check if there is a custom confirmation
      // that is not the default.
      if (el.isActive && !el.isDefault) {
        if (el.conditionalLogic) {
          const { rules, logicType } = el.conditionalLogic;
          const values = getValues(map(rules, ({ fieldId }) => `input_${fieldId}`));
          return getMatchesConditionalLogic(values, rules, logicType);
        }
        return true;
      }

      // If not, revert back to the default one.
      if (el.isDefault) {
        return true;
      }
    });

    if (confirmation.type == "PAGE") {
      // TODO: Somehow need to get the page URL. Query currently
      // returns the page ID for the page redirect.
      navigate(confirmation?.url);
    }

    if (confirmation.type == "REDIRECT") {
      // TODO: Check that the redirect is internal.
      // If not, use window.location to direct to external URL.
      navigate(confirmation?.url);
    }

    if (confirmation.type == "MESSAGE") {
      return (
        <div className="gform_confirmation_wrapper" aria-labelledby={`gform_confirmation_${databaseId}`} role="alert">
          <div
            id={`gform_confirmation_${databaseId}`}
            className="gform_confirmation_message"
            /* eslint-disable react/no-danger */
            dangerouslySetInnerHTML={{ __html: confirmation?.message }}
          />
        </div>
      );
    }
  }

  return (
    <div className="gform_wrapper" id={`gform_wrapper_${databaseId}`}>
      <div className="gform_anchor" id={`gf_${databaseId}`} />

      {formFields && (
        <FormProvider {...methods}>
          <form
            className={
              loading
                ? `gravityform gravityform--loading gravityform--id-${databaseId}`
                : `gravityform gravityform--id-${databaseId}`
            }
            id={`gform_${databaseId}`}
            key={`gform_-${databaseId}`}
            onSubmit={handleSubmit(onSubmitCallback)}
          >
            {generalError && <FormGeneralError errorCode={generalError} />}
            <div className="gform_heading"><h2 className="gform_title">{ title }</h2></div>
            <div className="gform_body">
              <ul
                className={clsx(
                  "gform_fields",
                  {
                    [`form_sublabel_${valueToLowerCase(
                      subLabelPlacement
                    )}`]: valueToLowerCase(subLabelPlacement),
                  },
                  `description_${valueToLowerCase(descriptionPlacement)}`,
                  `${valueToLowerCase(labelPlacement)}`
                )}
                id={`gform_fields_${databaseId}`}
              >
                <FieldBuilder
                  databaseId={databaseId}
                  formLoading={loading}
                  formFields={formFields.nodes}
                  labelPlacement={labelPlacement}
                  preOnSubmit={preOnSubmit}
                  settings={settings}
                />
              </ul>
            </div>

            <div className={`gform_footer ${valueToLowerCase(labelPlacement)}`}>
              <SubmitButton
                  {...{ loading, databaseId }}
                  text={submitButton?.text}
                  fieldData={{...{conditionalLogic: submitButton?.conditionalLogic}}}
              />
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

GravityFormForm.propTypes = {
  errorCallback: PropTypes.func,
  data: PropTypes.object.isRequired,
  successCallback: PropTypes.func,
  presetValues: PropTypes.shape({}),
};

GravityFormForm.defaultProps = {
  validationCallback: () => {},
  errorCallback: () => {},
  successCallback: () => {},
  presetValues: {},
};

export default GravityFormForm;

export const GravityFormFields = graphql`
  fragment GravityFormFields on WpGfForm {
    databaseId
    description
    descriptionPlacement
    labelPlacement
    subLabelPlacement
    title
    submitButton {
      ...SubmitButton
    }
    confirmations {
      ...FormConfirmation
    }
    formFields {
      nodes {
        displayOnly
        databaseId
        inputType
        layoutGridColumnSpan
        layoutSpacerGridColumnSpan
        pageNumber
        type
        visibility
        ...CaptchaField
        ...CheckboxField
        ...DateField
        ...EmailField
        ...HiddenField
        ...HtmlField
        ...MultiSelectField
        ...NumberField
        ...PhoneField
        ...RadioField
        ...SelectField
        ...TextAreaField
        ...TextField
        ...TimeField
        ...FileField
      }
    }
  }
`;

export const GravityFormSettings = graphql`
  fragment GravityFormSettings on Wp {
    gfSettings {
      recaptcha {
        publicKey
        type
      }
    }
  }
`;
