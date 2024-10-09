# How to contribute to frii.site

### Found a bug?

>[!CAUTION]
Found a vulnerability? Do **NOT** make an issue about it. Follow our [security policy](https://github.com/ctih1/frii.site-frontend/blob/master/SECURITY.md)

Have you come accross any bugs in frii.site? Repot them in the issues tab of this GitHub repo

## How to contribute
### Creating issues
When creating an issue, the guidelines aren't very strict. Coherent sentences would be nice, and a good description of the bug would help out a lot. There are a few rules though
1. If it's a bug, report your device's OS information (including what browser version you have)
2. Issues like  "Please help" or "Please fix" with no ability to actually help you will get closed.

### Pull Requests
Open up a pull request for any issues, or features you want. Just make sure to follow contribution guidelines. Make sure to make the pull request go to `dev` instead of `master`

### Submitting code
When submitting code, please respect the fact that the master branch is for **tested code**. You should **always** make pull requests go to the `dev` branch.
Try to use the following names for branches: `[features/fixes/enhancement]/[location (e.g dashboard, login)]/what you did`
If I were to improve the dashboard for mobile, I'd make the following branch: `enhancement/dashboard/mobile-adjustments`


### Setting up a development enviroment
This is quite simple.

1. `git clone https://github.com/ctih1/frii.site-frontend && cd frii.site-frontend`
2. `npm install`
3. `npm run dev`

### Contribution guidelines
* Please make commit messages actually useful. 

| Comment | accepted |
| -------- |--- |
| Fixed it | :x: |
| Adjusted arguements to the Button element in dashboard | :white_check_mark: |

* Write good, clean and readable code
* **Always** use Types where possible, and try to not use `//@ts-ignore`
* Try to stay away from 3rd party libraries
* Test your code before you run it!
* Have proper-ish grammar. Doesn't need to be perfect, but  should be easily understandable

### Any questions?
Feel free to start a discussion