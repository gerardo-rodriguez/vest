const path = require('path');

const fse = require('fs-extra');
const opts = require('vx/opts');

module.exports = addEsPackageJson;

function addEsPackageJson() {
  return {
    name: 'add-cjs-package-json',
    writeBundle: ({ format, file }) => {
      if (format !== opts.format.CJS) {
        return;
      }

      const packageJsonPath = path.join(
        path.dirname(file),
        opts.fileNames.PACKAGE_JSON
      );

      if (fse.existsSync(packageJsonPath)) {
        return;
      }

      fse.writeJSONSync(packageJsonPath, {
        type: 'commonjs',
      });
    },
  };
}
