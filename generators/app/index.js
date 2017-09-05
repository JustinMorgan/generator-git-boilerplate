'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var inquirer = require('inquirer');
const path = require('path');

const srcPath = path.join(__dirname, 'templates');
 
const getFiles = (dir) => fs.readdirSync(dir)
                            .filter(file => !fs.statSync(path.join(dir, file)).isDirectory());

const gitignore = getFiles(path.join(srcPath, 'gitignore'))
                      .filter(file => file && file.split('.')[0])
                      .sort();

const gitignoreGlobal = getFiles(path.join(srcPath, 'gitignore/Global'))
                          .filter(file => file && file.split('.')[0])
                          .sort();

module.exports = Generator.extend({
  prompting: function () {
    gitignore.map(file => {
                            name: file.split('.')[0]
                         })
                         .concat(new inquirer.Separator())
                         .concat({
                              name: '[Show more]'
                         })
                         .concat({
                              name: '[Skip]'
                         }).forEach(obj => {
                          this.log(obj.name);
                         })
    // this.log(yosay(
    //   'Welcome to the ' + chalk.red('git-boilerplate') + ' generator!'
    // ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What is your name? (for tagging your Git commits)'
    }, {
      type: 'input',
      name: 'email',
      message: 'What is your email? (for tagging your Git commits)'
    }, {
      type: 'rawlist',
      name: 'gitignore',
      message: 'What platform/IDE are you using?',
      choices: gitignore.map(file => {
                            name: file.split('.')[0]
                         })
                         .concat(new inquirer.Separator())
                         .concat({
                              name: '[Show more]'
                         })
                         .concat({
                              name: '[Skip]'
                         }),
      default: gitignore.indexOf('Node')
    }, {
      type: 'rawlist',
      name: 'gitignoreGlobal',
      message: 'What platform/IDE are you using? (continued)',
      choices: gitignoreGlobal.map(file => {
                            name: file.split('.')[0]
                         })
                         .concat(new inquirer.Separator())
                         .concat({
                              name: '[Skip]'
                         }),
      default: gitignoreGlobal.length,
      when: answers => answers.gitignore === gitignore.length
    }, {
      type: 'confirm',
      name: 'global',
      message: 'Do you want to make these settings global?'
      
    }];

    const prompts = [];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  },
  writing: function () {
    if (this.props.gitignoreGlobal && this.props.gitignoreGlobal < gitignoreGlobal.length) {
      this.fs.copy(
        this.templatePath(path.join(srcPath, 'gitignore/Global', gitignoreGlobal[this.props.gitignoreGlobal])),
        this.destinationPath('1.gitignore')
      );
    } else if (this.props.gitignore && this.props.gitignore < gitignore.length) {
      this.fs.copy(
        this.templatePath(path.join(srcPath, 'gitignore', gitignore[this.props.gitignore])),
        this.destinationPath('1.gitignore')
      );
    }
    this.fs.copy(
      this.templatePath(path.join(srcPath, '.gitconfig')),
      this.destinationPath('1.gitconfig')
    );
  },

  install: function () {
    //this.installDependencies();
  }
});
