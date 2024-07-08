import fs from 'fs'
import { posix } from 'path'
import debug from 'debug'

const log = debug('slim-git')

interface Options {
  /** The path to the git directory, defaults to the current working directory */
  gitDirectory: string
}

class SlimGit {
  #gitDirectory: string

  // TODO: might have to support Windows so / might not be the best separator here
  // might have to use posix.sep or something :shrug:

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

    if (!fs.existsSync(configPath)) {
      return null
    }

    const configContent = fs.readFileSync(configPath, 'utf8').trim()
    const urlMatch = configContent.match(/url = (.+)/)

    if (!urlMatch) {
      return null
    }

    return urlMatch[1]

    //TODO: Implement this
  }

  public getTag() {
    //TODO: Implement this
  }

  public isDirty() {
    //TODO: Implement this
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
