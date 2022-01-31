import type { ExecutablePlan, TrackedArguments } from "graphile-crystal";
import { lambda } from "graphile-crystal";
import { EXPORTABLE } from "graphile-exporter";
import type { Plugin } from "graphile-plugin";
import type { GraphQLObjectType } from "graphql";

import { version } from "../index";

declare global {
  namespace GraphileEngine {
    interface Inflection {
      nodeById(this: Inflection, typeName: string): string;
    }
    interface ScopeGraphQLObjectTypeFieldsField {
      isPgNodeQuery?: boolean;
    }
  }
}

export const NodeAccessorPlugin: Plugin = {
  name: "NodeAccessorPlugin",
  description:
    "Adds accessors for the various types registered with the Global Unique Object Identification ID (Node ID) system",
  version: version,

  inflection: {
    add: {
      nodeById(options, typeName) {
        return this.camelCase(typeName);
      },
    },
  },

  schema: {
    hooks: {
      GraphQLObjectType_fields(fields, build, context) {
        const {
          graphql: { GraphQLNonNull, GraphQLID },
        } = build;
        const {
          scope: { isRootQuery },
          Self,
          fieldWithHooks,
        } = context;
        if (!isRootQuery) {
          return fields;
        }

        const typeNames = build.getNodeTypeNames();
        const nodeIdFieldName = build.inflection.nodeIdFieldName();

        return typeNames.reduce((memo, typeName) => {
          // Don't add a field for 'Query'
          if (typeName === build.inflection.builtin("Query")) {
            return memo;
          }
          const handler = build.getNodeIdHandler(typeName)!;
          const codec = build.getNodeIdCodec(handler.codecName);
          return build.extend(
            memo,
            {
              [build.inflection.nodeById(typeName)]: {
                args: {
                  [nodeIdFieldName]: {
                    type: new GraphQLNonNull(GraphQLID),
                  },
                },
                type: build.getOutputTypeByName(typeName),
                plan: EXPORTABLE(
                  (codec, handler, lambda, nodeIdFieldName) =>
                    function plan(
                      $parent: ExecutablePlan<any>,
                      args: TrackedArguments,
                    ) {
                      const $spec = lambda(args[nodeIdFieldName], (value) => {
                        // We only want to return the specifier if it matches
                        // this handler; otherwise return null.
                        try {
                          const specifier = codec.decode(value);
                          if (handler.match(specifier)) {
                            return specifier;
                          }
                        } catch {
                          // Ignore errors
                        }
                        return null;
                      });
                      return handler.get($spec);
                    },
                  [codec, handler, lambda, nodeIdFieldName],
                ),
              },
            },
            `Adding ${typeName} by NodeId field`,
          );
        }, fields);
      },
    },
  },
};
