import inquirer from 'inquirer';

async function promptPassword() {
  const passwordInput = await inquirer.prompt([
    {
      name: 'password',
      message: 'Enter your password for Stevenson University:',
      type: 'password',
    },
  ]);

  return passwordInput.password;
}

export default promptPassword;
