
//////////// IMPORTS ////////////

const Log = require('@log');

//////////// PRIVATE ////////////

function handleErrors(err, ctrl) {
  return new Promise((resolve, reject) => {
    Log(2, '7. Handling Errors');
    Log(1, 'ERROR:', ctrl.repo.fNameBr, err);

    ctrl.conn.error(err);
    resolve(ctrl);
  });
}

//////////// EXPORTS ////////////

module.exports = handleErrors;