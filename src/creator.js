const chalk = require("chalk");
const inquirer = require("inquirer");
const memFs = require("mem-fs");
const memFsEditor = require("mem-fs-editor");
const path = require("path");
const fs = require("fs-extra");

class Creator {
  constructor() {
    const store = memFs.create();
    this.fs = memFsEditor.create(store);
    // 存储命令行获取的数据，作为demo这里只要这两个；
    this.options = {
      name: "",
      description: "",
    };
    // 当前根目录
    this.rootPath = path.resolve(__dirname, "../");
    // 模版目录
    this.tplDirPath = path.join(this.rootPath, "template");
  }
  getTplPath(file) {
    return path.join(this.tplDirPath, file);
  }

  copyTpl(src, to, data = {}) {
    //这里利用 fs-extra 来
    const tplPath = this.getTplPath(src);
    this.fs.copyTpl(tplPath, to, data);
  }

  copy(src, to) {
    const tplPath = this.getTplPath(src);
    this.fs.copy(tplPath, to);
  }
  copyDir(src, dest) {
    //使用 fs-extra 来复制目录
    const tplPath = this.getTplPath(src);
    fs.copy(tplPath, dest, (err) => {
      if (err) {
        console.error("创建文件夹是失败:", err);
      }
    });
  }
  // 初始化；
  init() {
    console.log(chalk.green("my cli 开始"));
    console.log();
    this.ask().then((answers) => {
      this.options = Object.assign({}, this.options, answers);
      this.write();
    });
  }
  // 和命令行交互；
  ask() {
    // 问题
    const prompt = [];
    prompt.push({
      type: "input",
      name: "name",
      message: "请输入项目名称",
      validate(input) {
        if (!input) {
          return "请输入项目名称!";
        }
        if (fs.existsSync(input)) {
          return "项目名已重复!";
        }
        return true;
      },
    });

    prompt.push({
      type: "input",
      name: "description",
      message: "请输入项目描述",
    });
    return inquirer.prompt(prompt);
  }
  // 拷贝&写数据；
  write() {
    console.log(chalk.green("my cli 构建开始"));
    const tplBuilder = require("./template.js");
    tplBuilder(this, this.options, () => {
      console.log(chalk.green("my cli 构建完成"));
      console.log();
      console.log(
        chalk.grey(`开始项目:  cd ${this.options.name} && npm install`)
      );
    });
  }
}

module.exports = Creator;
