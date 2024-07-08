import SlimGit from './SlimGit'

const git = new SlimGit()

const isGitDir = git.isGitDirectory()

console.log(isGitDir)

const branchName = git.getBranchName()

console.log(branchName)

const defaultBranchName = git.getDefaultBranchName()

console.log(defaultBranchName)
