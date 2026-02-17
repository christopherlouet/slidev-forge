---
sidebar_position: 2
---

# validate

Validate a YAML configuration file without generating a project.

## Usage

```bash
slidev-forge validate <config.yaml>
```

## Description

The `validate` command checks a YAML configuration file for:

- **Required fields**: `title` and `author` must be present
- **Section types**: All section `type` values must be valid (default, two-cols, image-right, quote, qna, thanks, about, code, diagram, cover, iframe, steps, fact)
- **YAML syntax**: Valid YAML format
- **Type consistency**: Correct data types for all fields

This is useful for:
- **Pre-flight checks**: Verify your config before running `slidev-forge`
- **CI/CD pipelines**: Validate configs in automated workflows
- **Config development**: Quickly test changes to YAML files

## Examples

```bash
# Validate a config file
slidev-forge validate presentation.yaml

# Validate a config in another directory
slidev-forge validate ~/talks/conference-2024/config.yaml
```

## Output

### Valid configuration

```
✔ Configuration is valid
```

### Invalid configuration

The command prints detailed error messages:

```
✖ Error: Missing required field: title
✖ Error: Unknown section type: "invalid-type"
✖ Error: Invalid YAML syntax at line 12
```

## Exit Codes

- **0**: Configuration is valid
- **1**: Configuration is invalid (error details printed to stderr)

## See Also

- [generate](./generate.md) - Generate a project from YAML
- [config](./config.md) - Modify configuration values
