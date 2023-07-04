import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as process from 'process'
import * as installer from '../src/installer'

describe('checkJavaInstall', () => {
  let logInfoSpy: jest.SpyInstance

  beforeEach(() => {
    logInfoSpy = jest.spyOn(core, 'info')
    logInfoSpy.mockImplementation(line => {
      // uncomment to debug
      //process.stderr.write('log:' + line + '\n')
    })
  })

  it('throws if JAVA_HOME undefined', async () => {
    delete process.env['JAVA_HOME']
    delete process.env['JAVA_EXEC']

    await expect(async () => await installer.checkJavaInstall()).rejects.toThrow()
  })

  it('exports JAVA_EXEC if JAVA_HOME defined but JAVA_EXEC undefined', async () => {
    process.env['JAVA_HOME'] = 'home'
    delete process.env['JAVA_EXEC']

    await installer.checkJavaInstall()

    expect(logInfoSpy).toHaveBeenCalledWith(`JAVA_HOME variable was found pointing at home`)
    expect(logInfoSpy).toHaveBeenCalledWith(`Exporting JAVA_EXEC variable with path to java binary: home/bin/java.exe`)
  })

  it('does nothing if both JAVA_HOME & JAVA_EXEC defined', async () => {
    process.env['JAVA_HOME'] = 'home'
    process.env['JAVA_EXEC'] = 'exec'

    await installer.checkJavaInstall()

    expect(logInfoSpy).toHaveBeenCalledWith(`JAVA_HOME variable was found pointing at home`)
    expect(logInfoSpy).toHaveBeenCalledWith(`JAVA_EXEC variable was found pointing at exec`)
  })
})

describe('getAntlr', () => {
  let logInfoSpy: jest.SpyInstance
  let findSpy: jest.SpyInstance
  let downloadToolSpy: jest.SpyInstance
  let cacheFileSpy: jest.SpyInstance

  beforeEach(() => {
    logInfoSpy = jest.spyOn(core, 'info')
    logInfoSpy.mockImplementation(line => {
      // uncomment to debug
      //process.stderr.write('log:' + line + '\n')
    })

    findSpy = jest.spyOn(tc, 'find')
    downloadToolSpy = jest.spyOn(tc, 'downloadTool')
    cacheFileSpy = jest.spyOn(tc, 'cacheFile')
  })

  it('downloads ANTLR and exports envVar', async () => {
    delete process.env['ANTLR_PATH']
    const version = '4.13.0'
    const envVar = 'ANTLR_PATH'
    const toolPath = 'path/to/antlr'
    findSpy.mockImplementation(() => undefined)
    downloadToolSpy.mockImplementation(() => toolPath)
    cacheFileSpy.mockImplementation(() => toolPath)

    await installer.getAntlr('latest', 'ANTLR_PATH')

    expect(logInfoSpy).toHaveBeenCalledWith(`Downloading ANTLR ${version} from official site: https://www.antlr.org/download/antlr-${version}-complete.jar`)
    expect(logInfoSpy).toHaveBeenCalledWith(`Exporting ANTLR_PATH variable with path to ANTLR jar: ${toolPath}`)
    expect(logInfoSpy).toHaveBeenCalledWith(`Access ANTLR via ${envVar} environment variable`)
  })

  it('skips ANTLR download if already cached', async () => {
    delete process.env['ANTLR_PATH']
    const version = '4.13.0'
    const envVar = 'ANTLR_PATH'
    const toolPath = 'path/to/antlr'
    findSpy.mockImplementation(() => toolPath)

    await installer.getAntlr(version, envVar)

    expect(logInfoSpy).toHaveBeenCalledWith(`ANTLR jar found in cache at: ${toolPath}`)
    expect(logInfoSpy).toHaveBeenCalledWith(`Exporting ANTLR_PATH variable with path to ANTLR jar: ${toolPath}`)
    expect(logInfoSpy).toHaveBeenCalledWith(`Access ANTLR via ${envVar} environment variable`)
  })
})
