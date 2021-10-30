const { spawn } = require('child_process');

const yarnOrNpmCommandMap = {
  yarn: {
    install: 'install',
    add: 'add',
  },
  npm: {
    install: 'install',
    add: 'install',
  },
};

const addReact = { 16: ['react@^16.0.1', 'react-dom@^16.0.1'], 17: ['react@^17.0.2', 'react-dom@^17.0.2'] };
const installDepFunc = (targetDir, answers) => {
  const { reactVersion, yarnOrNpm } = answers;
  console.log('这里开始安装', targetDir, answers);
  const installCommand = spawn(yarnOrNpm, [yarnOrNpmCommandMap[yarnOrNpm].install], {
    cwd: targetDir,
    stdio: 'inherit',
  });

  installCommand.on('close', function () {
    console.log('这里输出命令：', yarnOrNpm, yarnOrNpmCommandMap[yarnOrNpm].add, addReact[reactVersion]);
    spawn(yarnOrNpm, [yarnOrNpmCommandMap[yarnOrNpm].add, ...addReact[reactVersion]], {
      cwd: targetDir,
      stdio: 'inherit',
    });
  });
};

module.exports = installDepFunc;
