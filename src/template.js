const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const execa = require("execa");

module.exports = function (creator, options, callback) {
  const { name, description } = options;

  // 获取当前命令的执行目录，注意和项目目录区分
  const cwd = process.cwd();

  const projectPath = path.join(cwd, name);
  const configPath = path.join(projectPath, "config");
  const srcPath = path.join(projectPath, "src");

  // 新建项目目录
  // 同步创建目录，以免文件目录不对齐
  fs.mkdirSync(projectPath);
  fs.mkdirSync(configPath);
  fs.mkdirSync(srcPath);

  creator.copyTpl("package.json", path.join(projectPath, "package.json"), {
    name,
    description,
  });
  creator.copy("index.html", path.join(projectPath, "index.html"));
  creator.copy(".babelrc", path.join(projectPath, ".babelrc"));
  creator.copyDir("src", srcPath);
  creator.copyDir("config", configPath);

  //这一步是必须的，不然文件只是保存在内存中，不会生成的。
  creator.fs.commit(() => {
    console.log();
    console.log(`${chalk.grey(`创建项目: ${name}`)} ${chalk.green("✔ ")}`);
    console.log(`${chalk.grey(`创建目录: ${name}/src`)} ${chalk.green("✔ ")}`);
    console.log(
      `${chalk.grey(`创建目录: ${name}/config`)} ${chalk.green("✔ ")}`
    );
    console.log(
      `${chalk.grey(`创建文件: ${name}/index.html`)} ${chalk.green("✔ ")}`
    );
    console.log(
      `${chalk.grey(
        `创建文件: ${name}/config/webpack.common.js`
      )} ${chalk.green("✔ ")}`
    );
    console.log(
      `${chalk.grey(`创建文件: ${name}/config/webpack.dev.js`)} ${chalk.green(
        "✔ "
      )}`
    );
    console.log(
      `${chalk.grey(`创建文件: ${name}/config/webpack.prod.js`)} ${chalk.green(
        "✔ "
      )}`
    );
    console.log(
      `${chalk.grey(`创建文件: ${name}/src/index.js`)} ${chalk.green("✔ ")}`
    );
    console.log(
      `${chalk.grey(`创建文件: ${name}/src/App.js`)} ${chalk.green("✔ ")}`
    );
    const child = execa("yarn", [], {
      cwd: "test",
      stdio: ["inherit", "inherit", "pipe"],
    });
    child.stdout.on("data", (buffer) => {
      let str = buffer.toString().trim();
      //   process.stdout.write(buffer);
      console.log("这里是data里面的:", str);

      //   console.log("buffer:", str);
    });
    child.stderr.on("data", (buf) => {
      const str = buf.toString();
      console.log("这里输出str:", str);
    });
    // execaPromise.then((result) => {
    //   console.log(`${chalk.green("依赖安装完毕")}`, result.stdout);
    //   callback();
    // });
  });
};
