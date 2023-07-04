import * as core from '@actions/core'
import * as installer from './installer'

const TOOL_NAME = 'antlr4'
const VERSION = '4.8'

async function run(): Promise<void> {
  try {
    await installer.checkJavaInstall()
    await installer.getAntlr(TOOL_NAME, VERSION)
  } catch (error) {
    if (typeof error === 'string') {
      core.setFailed(error)
    } else if (error instanceof Error) {
      core.setFailed(error)
    }
  }
}

run()
