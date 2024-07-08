import fs from "fs";

interface Options {
  /** The path to the git directory, defaults to the current working directory */
  gitDirectory: string;
}

class SlimGit {
  #gitDirectory: string;

  // TODO: might have to support Windows so / might not be the best separator here
  // might have to use posix.sep or something :shrug:

  constructor({ gitDirectory }: Options = { gitDirectory: process.cwd() }) {
    this.#gitDirectory = `${gitDirectory}/.git`;
  }

  public isGitDirectory(): boolean {
    return fs.existsSync(this.#gitDirectory);
  }

  public getBranchName(): string | null {
    const headFile = `${this.#gitDirectory}/HEAD`;

    return this.parseBranchFile(headFile);
  }

  public getDefaultBranchName(): string | null {
    //TODO: Support other cases than origin
    const headFile = `${this.#gitDirectory}/refs/remotes/origin/HEAD`;

    return this.parseBranchFile(headFile);
  }

  public getCommitInfo() {
    //TODO: Implement this
  }

  public getRemoteUrl() {
    //TODO: Implement this
  }

  public getTag() {
    //TODO: Implement this
  }

  public isDirty() {
    //TODO: Implement this
  }

  private parseBranchFile(branchFile: string): string | null {
    if (!this.isGitDirectory() || !fs.existsSync(branchFile)) {
      return null;
    }

    const branchContent = fs.readFileSync(branchFile, "utf8").trim();
    const branchName = branchContent.split("/").pop();

    if (!branchName) {
      return null;
    }

    return branchName;
  }
}

export default SlimGit;
