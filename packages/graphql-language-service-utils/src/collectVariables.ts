import {
  typeFromAST,
  GraphQLSchema,
  DocumentNode,
  NamedTypeNode,
  GraphQLInputType,
} from 'graphql';

export type VariableToType = {
  [variable: string]: GraphQLInputType;
};

/**
 * Collects all variables in a document of operations
 *
 * @param schema
 * @param documentAST
 * @returns {VariableToType}
 */
export function collectVariables(
  schema: GraphQLSchema,
  documentAST: DocumentNode,
): VariableToType {
  const variableToType: VariableToType = Object.create(null);
  documentAST.definitions.forEach(definition => {
    if (definition.kind === 'OperationDefinition') {
      const variableDefinitions = definition.variableDefinitions;
      if (variableDefinitions) {
        variableDefinitions.forEach(({ variable, type }) => {
          const inputType = typeFromAST(
            schema,
            type as NamedTypeNode,
          ) as GraphQLInputType;
          if (inputType) {
            variableToType[variable.name.value] = inputType;
          }
        });
      }
    }
  });
  return variableToType;
}