import { npmSearchGenerator } from "./npm";

const completionSpec: Fig.Spec = {
  name: "nlx",
  description: "Download & execute a package binary with the correct agent",
  args: [
    {
      name: "commandOrPackage",
      description: "Package name (and optional subcommand) to execute",
      isOptional: false,
      generators: npmSearchGenerator,
    },
    {
      name: "args",
      isOptional: true,
      isVariadic: true,
      description: "Arguments passed to the executed binary",
    }
  ],
  options: [
    {
      name: "-C",
      description: "Change directory before running the command",
      args: { name: "path", template: "folders" },
    },
    {
      name: ["-h", "--help"],
      description: "Show help",
    },
    {
      name: ["-v", "--version"],
      description: "Show version",
    },
  ],
  examples: [
    {
      name: "Run a package binary (vitest)",
      example: "nlx vitest",
    },
  ],
};

export default completionSpec;
