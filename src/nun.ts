import { npmSearchGenerator } from "./npm";

const completionSpec: Fig.Spec = {
  name: "nun",
  description: "Uninstall dependencies with the correct agent",
  args: [
    {
      name: "packages",
      description: "Packages to remove (omit to enter interactive mode)",
      isOptional: true,
      isVariadic: true,
      generators: npmSearchGenerator,
    }
  ],
  options: [
    {
      name: "-m",
      description: "Interactive multiple selection to remove",
    },
    {
      name: ["-g", "--global"],
      description: "Uninstall globally",
    },
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
      name: "Remove a dependency",
      example: "nun webpack",
    },
    {
      name: "Interactive removal",
      example: "nun",
    },
    {
      name: "Interactive multi-remove",
      example: "nun -m",
    },
    {
      name: "Uninstall a global package",
      example: "nun -g silent",
    },
  ],
};

export default completionSpec;
