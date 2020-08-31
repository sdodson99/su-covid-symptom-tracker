import inquirer from 'inquirer';

async function promptUsername() {
  const usernameInput = await inquirer.prompt([
    {
      name: 'username',
      message: 'Enter your username for Stevenson University:',
      type: 'input',
    },
  ]);

  return usernameInput.username;
}

export default promptUsername;
