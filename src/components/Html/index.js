import clsx from "clsx";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import React from "react";
import InputWrapper from "../../components/InputWrapper";
import { valueToLowerCase } from "../../utils/helpers";
import withConditionalLogic from "../../Hoc/withConditionalLogic";

const Html = ({ fieldData, name, wrapClassName, ...wrapProps }) => {
  const { content, cssClass, type } = fieldData;

  return (
    <InputWrapper
      {...wrapProps}
      inputData={fieldData}
      labelFor={name}
      wrapClassName={clsx(
        wrapClassName,
        "gfield_html",
        "gfield_html_formatted",
        "gfield_no_follows_desc",
        "gravityform__" + valueToLowerCase(type) + "__wrap",
        cssClass
      )}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </InputWrapper>
  );
};

export default withConditionalLogic(Html);

Html.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
    content: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapClassName: PropTypes.string,
  wrapProps: PropTypes.object,
};

export const HtmlField = graphql`
  fragment HtmlField on WpHtmlField {
    conditionalLogic {
      ...ConditionalLogic
    }
    content
    cssClass
    hasMargins
    label
  }
`;
