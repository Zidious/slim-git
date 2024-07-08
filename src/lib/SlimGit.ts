import fs from 'fs'
import { posix } from 'path'
import debug from 'debug'

const log = debug('slim-git')

interface Options {
  /** The path to the git directory, defaults to the current working directory */
  gitDirectory: string
}

// TODOs left
// - TODO: Add getCommitInfo method
// - TODO:: finish isDirty method
// - TODO: Add tests

class SlimGit {
  #gitDirectory: string

  constructor({ gitDirectory }: Options = { gitDirectory: process.cwd() }) {
    log('Initializing SlimGit with options:', { gitDirectory })
    this.#gitDirectory = `${gitDirectory}${posix.sep}.git`
  }

  public isGitDirectory(): boolean {
    const doesExist = fs.existsSync(this.#gitDirectory)
    log('Checking if git directory exists:', { doesExist })

    return doesExist
  }

  public getBranchName(): string | null {
    const headFile = `${this.#gitDirectory}${posix.sep}HEAD`
    log('Getting branch name from HEAD file:', { headFile })

    const branchName = this.parseBranchFile(headFile)
    log('Branch name:', { branchName })

    return branchName
  }

  public getDefaultBranchName(): string | null {
    //TODO: Support other cases than origin
    const headFile = `${this.#gitDirectory}${posix.sep}refs${posix.sep}remotes${
      posix.sep
    }origin${posix.sep}HEAD`
    log('Getting default branch name from HEAD file:', { headFile })

    const defaultBranchName = this.parseBranchFile(headFile)
    log('Default branch name:', { defaultBranchName })

    return defaultBranchName
  }

  public getCommitInfo() {
    //TODO: Implement this
  }

  public getRemoteUrl() {
    const configPath = `${this.#gitDirectory}${posix.sep}config`
    log('Getting remote URL from config file:', { configPath })

    if (!fs.existsSync(configPath)) {
      log('Config file does not exist')
      return null
    }

    const configContent = fs.readFileSync(configPath, 'utf8').trim()
    log('Config content:', { configContent })

    /**
     * @example
     *
     * [remote "origin"]
     *   url = 'https://github.com/<org>/<repo>.git'
     */
    const urlMatch = configContent.match(/url = (.+)/)
    log('URL match:', { urlMatch })

    if (!urlMatch || urlMatch.length < 2) {
      log('URL could not be parsed')
      return null
    }

    return urlMatch[1]
  }

  public getTag() {
    const tagsPath = `${this.#gitDirectory}${posix.sep}refs${posix.sep}tags`
    log('Getting tags from tags directory:', { tagsPath })

    if (!fs.existsSync(tagsPath)) {
      log('Tags directory does not exist')
      return null
    }

    const tags = fs.readdirSync(tagsPath)
    log('Tags:', { tags })

    if (!tags.length) {
      log('No tags found')
      return null
    }

    const latestTag = tags[tags.length - 1]
    log('Latest tag:', { latestTag })

    return latestTag
  }

  public isDirty() {
    const indexFile = `${this.#gitDirectory}${posix.sep}index`

    if (!fs.existsSync(indexFile)) {
      return null
    }

    const indexContent = fs.readFileSync(indexFile, 'utf8')

    return false
  }

  private parseBranchFile(branchFile: string): string | null {
    log('Parsing branch file:', { branchFile })
    if (!this.isGitDirectory() || !fs.existsSync(branchFile)) {
      log('Git directory or branch file does not exist')

      return null
    }

    const branchContent = fs.readFileSync(branchFile, 'utf8').trim()
    log('Branch content:', { branchContent })

    const branchName = branchContent.split('/').pop()

    if (!branchName) {
      log('Branch name could not be parsed')

      return null
    }

    return branchName
  }
}

export default SlimGit
