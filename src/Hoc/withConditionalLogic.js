import React, { useEffect, useState, useMemo } from "react"
import { map, each } from "lodash";

import { getMatchesConditionalLogic } from "../utils/helpers";
import { useFormContext } from "react-hook-form";

const withConditionalLogic = (Component) => (props) => {

    const { fieldData: { conditionalLogic } } = props;
    const { watch } = useFormContext();
    const [shouldShow, setShouldShow] = useState(!conditionalLogic);

    const fieldsToWatch = useMemo(() => (
        conditionalLogic ? map(conditionalLogic.rules, ({ fieldId}) => `input_${fieldId}`) : null
    ), [conditionalLogic]);
    const valuesToWatch = fieldsToWatch ? watch(fieldsToWatch) : null;

    useEffect(() => {
        if (conditionalLogic) {
            const { rules, logicType, actionType } = conditionalLogic;
            const passesConditionalLogic = getMatchesConditionalLogic(valuesToWatch, rules, logicType);
            if (actionType === 'SHOW') {
                setShouldShow(passesConditionalLogic);
            } else {
                setShouldShow(!passesConditionalLogic);
            }
        }
    }, [valuesToWatch, conditionalLogic, fieldsToWatch]);

    return shouldShow ? <Component {...props} /> : null;
}

export default withConditionalLogic;
