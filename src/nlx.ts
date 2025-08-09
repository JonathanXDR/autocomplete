import bunxSpec from "./bunx";
import { npmSearchGenerator } from "./npm";
import npxSpec, { npxSuggestions } from "./npx";
import pnpxSpec from "./pnpx";

// Helper to coerce a Fig.Spec into a Fig.Subcommand when possible
const toSubcommand = (spec: Fig.Spec): Fig.Subcommand | null => {
  if (typeof spec === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (spec as any)();
    if (res && typeof res === "object" && "versionedSpecPath" in res)
      return null;
    return res as Fig.Subcommand;
  }
  return spec as Fig.Subcommand;
};

const npxCmd = toSubcommand(npxSpec);
const bunxCmd = toSubcommand(bunxSpec);
const pnpxCmd = toSubcommand(pnpxSpec);

const mergedSubcommands: Fig.Subcommand[] = [
  ...(npxCmd?.subcommands ?? []),
  ...(bunxCmd?.subcommands ?? []),
  ...(pnpxCmd?.subcommands ?? []),
];

const mergedOptions: Fig.Option[] = [
  ...(npxCmd?.options ?? []),
  ...(bunxCmd?.options ?? []),
  ...(pnpxCmd?.options ?? []),
].filter((opt, idx, arr) => {
  const key = Array.isArray(opt.name) ? opt.name.join("|") : String(opt.name);
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
  subcommands: mergedSubcommands,
  args: [
    {
      name: "commandOrPackage",
      description: "Package name (and optional subcommand) to execute",
      isOptional: true,
      generators: npmSearchGenerator,
      suggestions: npxSuggestions,
    },
    {
      name: "args",
      isOptional: true,
      isVariadic: true,
      description: "Arguments passed to the executed binary",
    },
  ],
  options: [
    ...mergedOptions,
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
