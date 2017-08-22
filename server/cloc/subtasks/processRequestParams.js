//////////// IMPORTS ////////////

const Promise = require('bluebird'),
      config = require('@config'),
      Log = require('@log');

//////////// PRIVATE ////////////

// initialize the repo object
function processRequestParams(ctrl) {
  return new Promise((resolve, reject) => {

    let { owner, name, branch, username, password } = ctrl.params;
    let fNameBr = `${owner}/${name}` + (branch ? `::${branch}` : '');

    Log(2, `NEW REPO: ${fNameBr}`);
    Log(2, '1. Processing Request Params');

    //// 1. construct repo object ////
    if (!owner || !name)
      reject(config.errors.NeedOwnerAndName);

    ctrl.repo = {
      owner:    owner,
      name:     name,
      branch:   branch || '',
      fullName: owner + '/' + name,
      fNameBr:  fNameBr
    };

    //// 2. handle credentals ////
    ctrl.creds = {
      username: username && username.replace(/@/g, '%40'),
      password: password && password.replace(/@/g, '%40')
    };

    delete ctrl.params.password;
    delete ctrl.params.username;

    //// 3. generate unique folderName ////
    ctrl.folderName = config.repoToFolder(ctrl.repo.fullName, ctrl.uid);

    resolve(ctrl);
  });
}

//////////// EXPORTS /////////////

module.exports = processRequestParams;

