#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, '../build-info.json');

function getEnvironmentVariable(name) {
  if (process.env[name]) {
    return process.env[name];
  }
  throw new Error(`Missing env var ${name}`);
}

fs.writeFileSync(
  target,
  JSON.stringify({
    buildNumber: getEnvironmentVariable('BUILD_NUMBER'),
    gitRef: getEnvironmentVariable('GIT_REF'),
    gitDate: getEnvironmentVariable('GIT_DATE'),
  }),
);
