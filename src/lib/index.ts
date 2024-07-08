import SlimGit from './SlimGit'

const git = new SlimGit()

const isGitDir = git.isGitDirectory()

console.log(isGitDir)

const branchName = git.getBranchName()

console.log(branchName)

const defaultBranchName = git.getDefaultBranchName()

console.log(defaultBranchName)

const remoteUrl = git.getRemoteUrl()

console.log(remoteUrl)

const isDirty = git.isDirty()

console.log(isDirty)

const tags = git.getTag()

console.log(tags)
