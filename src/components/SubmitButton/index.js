import React from "react";
import PropTypes from "prop-types";

import withConditionalLogic from "../../Hoc/withConditionalLogic";

const SubmitButton = ({ loading, databaseId, text }) => {
    return (
        <button
            className="gravityform__button gform_button button"
            disabled={loading}
            id={`gform_submit_button_${databaseId}`}
            type="submit"
        >
            {loading ? (
                <span className="gravityform__button__loading_span">
                    Loading
                  </span>
            ) : (
                text
            )}
        </button>
    )
}

SubmitButton.propTypes = {
    loading: PropTypes.bool,
    databaseId: PropTypes.number,
    text: PropTypes.string
}

export default withConditionalLogic(SubmitButton);