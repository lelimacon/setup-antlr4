import * as core from '@actions/core'
import * as installer from './installer'

async function run(): Promise<void> {
  try {
    await installer.checkJavaInstall()

    const version = core.getInput('version')
    await installer.getAntlr(version, 'Antlr4ToolPath')
  } catch (error) {
    if (typeof error === 'string') {
      core.setFailed(error)
    } else if (error instanceof Error) {
      core.setFailed(error)
    }
  }
}

run()
