#!/usr/bin/env node
const inquirer = require('inquirer');
const downloadAndUnzip = require('./download');
const path = require('path');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'packageName',
      message: '项目名称',
      default: 'react-webpack-template',
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述',
    },
    {
      type: 'list',
      name: 'reactVersion',
      message: 'react 版本',
      choices: ['16', '17'],
    },
    // {
    //   type: 'list',
    //   name: 'webpackVersion',
    //   message: 'webpack 版本',
    //   choices: ['4', '5'],
    // },
    {
      type: 'list',
      name: 'yarnOrNpm',
      message: '使用工具',
      choices: ['yarn', 'npm'],
    },
  ])
  .then(answers => {
    downloadAndUnzip(answers);
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
