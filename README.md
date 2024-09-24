# Today's NHL Games :ice_hockey:
An API-first NHL fan dashboard, making use of [some amazing work](https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md) documenting the recently-changed NHL API. Currently the client handles all requests through a proxy as the endpoint is public, and uses react-bootstrap for layout and a few helpful components. Lots of things need to be fixed or added :)

## Install
- Clone this repo
- cd into cloned directory
- `npm install` the dependencies
- `npm run start`
- Note: package.json includes a github pages deploy script that must be changed should you want to host this via github pages through your account. Info [here](https://github.com/gitname/react-gh-pages).

## Deploy hint
(For me because I forget what to run when I need to redeploy) `npm run deploy -- -m "commit message"`