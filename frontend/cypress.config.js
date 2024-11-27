const { defineConfig } = require('cypress');
const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      installLogsPrinter(on, {
        outputRoot: 'cypress/logs',
        outputTarget: {
          'terminal.log': 'txt',
        },
      });
      return config;
    },
  },
});
