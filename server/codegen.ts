import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/entites/**/type-defs.graphql",
  generates: {
    "src/types/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: "../context#Context",
        useTypeImports: true,
        useIndexSignature: true,
        enumsAsTypes: true,
        scalars: {
          ID: "string",
        },
      },
    },
  },
};

export default config;
