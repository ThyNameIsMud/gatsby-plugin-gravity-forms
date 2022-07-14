import { gql } from "@apollo/client";

export default gql`
  mutation submitForm($databaseId: ID!, $fieldValues: [FormFieldValuesInput]!, $clientMutationId: String!) {
    submitGfForm(input: { id: $databaseId, fieldValues: $fieldValues, clientMutationId: $clientMutationId }) {
      errors {
        id
        message
      }
      confirmation {
        type
        message
        url
      }
    }
  }
`;
