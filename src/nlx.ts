import bunxSpec from "./bunx";
import { npmSearchGenerator } from "./npm";
import npxSpec, { npxSuggestions } from "./npx";
import pnpxSpec from "./pnpx";

/**
 * nlx: download & execute (npx / yarn dlx / pnpm dlx / bunx / deno run npm:)
 * We can't detect the agent from the completion side, so we compose
 * subcommands and options from the upstream specs (npx, bunx, pnpx)
 * to get rich argument completion for known executables.
 */

const mergedSubcommands: Fig.Subcommand[] = [
  ...(npxSpec.subcommands ?? []),
  ...(bunxSpec.subcommands ?? []),
  ...(pnpxSpec.subcommands ?? []),
];

// Merge a minimal option set that is common/safe across invocations.
// (Avoid agent-specific flags that might not apply across all.)
const mergedOptions: Fig.Option[] = [
  ...(npxSpec.options ?? []),
  ...(bunxSpec.options ?? []),
  ...(pnpxSpec.options ?? []),
].filter((opt, idx, arr) => {
  const key = Array.isArray(opt.name) ? opt.name.join("|") : String(opt.name);
  // de-duplicate by "name" signature
  return (
    idx ===
    arr.findIndex((o) => {
      const k = Array.isArray(o.name) ? o.name.join("|") : String(o.name);
      return k === key;
    })
  );
});

const completionSpec: Fig.Spec = {
  name: "nlx",
  description: "Download & execute a package binary with the correct agent",
  // Known commands get full arg/option completion via subcommands;
  // Unknown packages still get npm search suggestions via args below.
  subcommands: mergedSubcommands,
  args: [
    {
      name: "commandOrPackage",
      description: "Package name (and optional subcommand) to execute",
      isOptional: true,
      generators: npmSearchGenerator,
      suggestions: npxSuggestions, // reuse curated list from npx
    },
    {
      name: "args",
      isOptional: true,
      isVariadic: true,
      description: "Arguments passed to the executed binary",
    },
  ],
  options: [
    // a lightweight, deduped union
    ...mergedOptions,
    // global utility flags (safe across agents)
    {
      name: "-C",
      description: "Change directory before running the command",
      args: { name: "path", template: "folders" },
    },
    { name: ["-h", "--help"], description: "Show help" },
    { name: ["-v", "--version"], description: "Show version" },
  ],
};

export default completionSpec;
