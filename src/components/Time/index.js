import clsx from "clsx";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import strings from "../../utils/strings";
import { valueToLowerCase } from "../../utils/helpers";
import InputWrapper from "../InputWrapper";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const timeinputMapping = [ 'hh', 'mm', 'ampm' ];

const Time = ({ fieldData, name, id, readonly, ...wrapProps }) => {
    const {
        cssClass,
        inputs,
        isRequired,
        timeFormat,
        type
    } = fieldData;

    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext();

    const hours = useWatch({ name: `${name}_${timeinputMapping[0]}`});
    const minutes = useWatch({ name: `${name}_${timeinputMapping[1]}`});
    const ampm = useWatch({ name: `${name}_${timeinputMapping[2]}`});

    const isValid = () => {
        if (timeFormat === 'H12') {
            return !!hours && !!minutes && !!ampm;
        }
        return !!hours && !!minutes;
    }

    const getHoursMin = () => {
        if (timeFormat === 'H12') {
            return 1;
        }
        return 0;
    }

    const getHoursMax = () => {
        if (timeFormat === 'H12') {
            return 12;
        }
        return 23;
    }

    useEffect(() => {
        let value = [hours, minutes].join(':');
        if (ampm) {
            value += ` ${ampm}`;
        }
        setValue(name, value);
    }, [hours, minutes, ampm]);

    return (
        <InputWrapper
            errors={errors?.[name] || {}}
            inputData={fieldData}
            labelFor={id}
            {...wrapProps}
        >
        <input type='hidden'
               {...register(name, {
                       required: isRequired && strings.errors.required,
                       validate: {
                           allFields: value => value && isValid() || strings.errors.required
                       }
                   }
               )}/>

            {inputs.map(({ placeholder } , i) => (
                i < 2 ? (
                    <>
                        <input
                            key={`time-input-${i}`}
                            aria-invalid={Boolean(errors?.[name])}
                            aria-required={isRequired}
                            className={clsx(
                                "gravityform__field__input",
                                    `gravityform__field__input__${valueToLowerCase(type)}`,
                            )}
                            id={`${id}_${timeinputMapping[i]}`}
                            name={`${name}_${timeinputMapping[i]}`}
                            placeholder={placeholder}
                            {...register(`${name}_${timeinputMapping[i]}`, {
                                required: isRequired && strings.errors.required,
                                shouldUnregister: true
                            })}
                            type='number'
                            readOnly={readonly}
                            min={i === 0 ? getHoursMin() : 0}
                            max={i === 0 ? getHoursMax() : 59}
                        />
                        {i === 0 ?
                            <span className="gravityform__field__input__time__spacer">:</span>
                            : null}
                        </>
                ) :  timeFormat === 'H12' ? (
                        <select
                            key={`time-input-${i}`}
                            className={clsx(
                                "gravityform__field__input",
                                `gravityform__field__input__${valueToLowerCase(type)}`,
                            )}
                            id={`${id}_${timeinputMapping[i]}`}
                            name={`${name}_${timeinputMapping[i]}`}
                            aria-invalid={Boolean(errors?.[name])}
                            readOnly={readonly}
                            {...register(`${name}_${timeinputMapping[i]}`, {
                                required: isRequired && strings.errors.required,
                                shouldUnregister: true
                            })}
                        >
                            <option>AM</option>
                            <option>PM</option>
                        </select>
                ) : null
            ))}
        </InputWrapper>
    );
};

export default withConditionalLogic(Time);

Time.propTypes = {
    fieldData: PropTypes.shape({
        cssClass: PropTypes.string,
        isRequired: PropTypes.bool,
        timeFormat: PropTypes.string,
        type: PropTypes.string,
        inputs: PropTypes.array
    }),
    value: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    wrapProps: PropTypes.object,
    readonly: PropTypes.bool
};

export const TimeField = graphql`
    fragment TimeField on WpTimeField {
        adminLabel
        canPrepopulate
        conditionalLogic {
            ...ConditionalLogic
        }
        cssClass
        description
        descriptionPlacement
        errorMessage
        inputs {
            ... on WpTimeInputProperty {
                placeholder
            }
        }
        isRequired
        label
        labelPlacement
        timeFormat
        value
    }
`;
