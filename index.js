#!/usr/bin/env node

// const chokidar = require('chokidar');
// const debounce = require('lodash.debounce');
// const program = require('caporal');
// const fs = require('fs');
// const { spawn } = require('child_process');

import { spawn } from 'child_process';
import fs from 'fs';
import program from 'caporal';
import debounce from 'lodash.debounce';
import chokidar from 'chokidar';
import chalk from 'chalk';

program
  .version('0.0.1')
  .argument('[filename]', 'Name of a file to execute')
  .action(async ({filename}) => {
    const name = filename || 'index.js';

    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find the file ${name}`);
    }

    let proc;
    const start = debounce(() => {
      if (proc) {
        proc.kill();
      }
      console.log(chalk.blue('>>> Starting process...'));
      proc = spawn('node', [name], { stdio: 'inherit' })
    }, 100);

    chokidar
    .watch('.')
    .on('add', start)
    .on('change', start)
    .on('unlink', start);
  });

program.parse(process.argv);