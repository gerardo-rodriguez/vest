const path = require('path');

const glob = require('glob');
const opts = require('vx/opts');
const packageNames = require('vx/packageNames');
const pathsPerPackage = require('vx/util/pathsPerPackage');
const { usePackage } = require('vx/vxContext');
const vxPath = require('vx/vxPath');

const setupPerPackage = glob.sync(
  vxPath.packageConfigPath(
    usePackage() ?? '*',
    'jest',
    opts.fileNames.JEST_SETUP
  )
);

const setupAfterEnvPerPackage = glob.sync(
  vxPath.packageConfigPath(
    usePackage() ?? '*',
    'jest',
    opts.fileNames.JEST_SETUP_AFTER_ENV
  )
);

const projects = packageNames.list.map(packageName => ({
  ...baseConfig(),
  displayName: packageName,
  moduleNameMapper: genNameMapper(pathsPerPackage.packages[packageName]),
  rootDir: vxPath.package(packageName),
  testMatch: [`**/${opts.dir.TESTS}/*.(spec|test).ts`],
}));

module.exports = {
  projects,
};

function baseConfig() {
  return {
    clearMocks: true,
    globals: {
      'ts-jest': {
        diagnostics: {
          // Essentially ignoring "any" errors in TESTS
          ignoreCodes: [
            'TS7005',
            'TS7006',
            'TS7016',
            'TS7034',
            'TS7053',
            'TS7031',
            'TS2339',
          ],
        },
      },
    },
    preset: 'ts-jest',
    rootDir: vxPath.ROOT_PATH,
    roots: ['<rootDir>'],
    setupFiles: [
      path.resolve(vxPath.JEST_CONFIG_PATH, opts.fileNames.JEST_SETUP),
    ].concat(setupPerPackage),
    setupFilesAfterEnv: [
      path.resolve(
        vxPath.JEST_CONFIG_PATH,
        opts.fileNames.JEST_SETUP_AFTER_ENV
      ),
    ].concat(setupAfterEnvPerPackage),
    testEnvironment: 'node',
  };
}

function genNameMapper(modules) {
  return modules.reduce(
    (aliases, { name, absolute }) =>
      Object.assign(aliases, {
        [`^${name}$`]: absolute,
      }),
    {}
  );
}
