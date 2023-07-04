# GitHub Action to setup ANTLR 4.8

![Test action](https://github.com/NiccoMlt/setup-antlr4/workflows/Test%20action/badge.svg)

This action pulls complete ANTLR 4.X jar and defines `Antlr4ToolPath` environment variable pointing to it.
Some tools (i.e. [Antlr4BuildTasks](https://github.com/kaby76/Antlr4BuildTasks)) require this kind of configuration;
for this kind of usage, it also declares the required `JAVA_EXEC` variable if `JAVA_HOME` is available.

## Inputs

### `version`

**Required** ANTLR version: "latest" (4.13.0) or a specific version. Defaults to `'latest'`.

## Usage

Example with 'latest' version :

```yaml
steps:
- uses: actions/checkout@v2
- uses: NiccoMlt/setup-antlr4@v0.0.7
```

Example with specific version :

```yaml
steps:
- uses: actions/checkout@v2
- uses: NiccoMlt/setup-antlr4@v0.0.7
  with:
    version: '4.9.3'
```

You probably also want to add `actions/setup-java` to run the jar correctly.

## Improvements

### Script definition

The action also adds the jar in PATH, but this is pretty much useless currently.
You can simply add your own script like explained in the [official documentation](https://github.com/antlr/antlr4/blob/master/doc/getting-started.md):

`antlr4`:

```bash
#!/bin/sh
java -cp "$Antlr4ToolPath:$CLASSPATH" org.antlr.v4.Tool $@
```

`grun`:

```bash
#!/bin/sh
java -cp ".:$Antlr4ToolPath:$CLASSPATH" org.antlr.v4.gui.TestRig $@
```

`antlr4.bat`:

```batch
java -cp "%Antlr4ToolPath%;%CLASSPATH%" org.antlr.v4.Tool %*
```

`grun.bat`:

```batch
java -cp ".;%Antlr4ToolPath%;%CLASSPATH%" org.antlr.v4.gui.TestRig %*
```

`antlr4.ps1`:

```powershell
java -cp "$Env:Antlr4ToolPath$([System.IO.Path]::PathSeparator)$Env:CLASSPATH" org.antlr.v4.Tool $args
```

`grun.ps1`:

```powershell
java -cp ".$([System.IO.Path]::PathSeparator)$Env:Antlr4ToolPath$([System.IO.Path]::PathSeparator)$Env:CLASSPATH" org.antlr.v4.gui.TestRig $args
```

In a future version, I will probably add also these scripts to PATH.
