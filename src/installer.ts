import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as fs from 'fs'

export async function checkJavaInstall(): Promise<void> {
  const javaHome = process.env.JAVA_HOME
  const javaExec = process.env.JAVA_EXEC

  if (!javaHome) {
    throw Error(`JAVA_HOME variable was not found`)
  }

  core.info(`JAVA_HOME variable was found pointing at ${javaHome}`)

  if (javaExec) {
    core.info(`JAVA_EXEC variable was found pointing at ${javaExec}`)
    return
  }

  let javaBin = path.join(javaHome, 'bin', 'java')
  try {
    await fs.promises.access(javaBin)
  } catch (error) {
    javaBin = `${javaBin}.exe`
  }
  core.info(`Exporting JAVA_EXEC variable with path to java binary: ${javaBin}`)
  core.exportVariable('JAVA_EXEC', javaBin)
}

export async function getAntlr(
  toolName: 'antlr' | 'antlr4',
  version: string,
  envVar = 'Antlr4ToolPath'
): Promise<void> {
  let toolPath: string = tc.find(toolName, version)
  const file = `antlr-${version}-complete.jar`
  const downloadPath = `https://www.antlr.org/download/${file}`

  if (toolPath) {
    core.info(`Tool found in cache ${toolPath}`)
  } else {
    core.info(`Downloading ANTLR ${version} from official site: ${downloadPath}`)
    const antlr4 = await tc.downloadTool(downloadPath)
    toolPath = await tc.cacheFile(antlr4, file, toolName, version)
    core.info(`Tool stored in ${toolPath} and added to PATH`)
    core.info(`It is possible to access it via ${envVar} environment variable`)
  }

  const antlr4ToolPath = path.join(toolPath, file)
  core.exportVariable(envVar, antlr4ToolPath)
  core.addPath(toolPath)
}
