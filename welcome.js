(async () => {
	const json = require('./package.json')
	const chalk = await import('chalk');
	const figlet = await import('figlet');
  
	console.log(
	  chalk.default.green(
		figlet.default.textSync('cypress - crud', {
		  font: 'Standard',
		  width: 150,
		  horizontalLayout: 'default',
		  verticalLayout: 'default',
		  whitespaceBreak: true
		})
	  )
	);
	console.log('');

	console.log(chalk.default.blue.bold(`                Welcome cypress-crud ${json.version}`));
	console.log(chalk.default.yellow.bold('                The best framework for API testing'));
	console.log('');
	console.log(chalk.default.blue('--------------------------------------------------------'));
	console.log(chalk.default.green.bold('Documentation:'));
	console.log(chalk.default.green('Visit https://github.com/JamesonBatista/cypress-crud'));
	console.log(chalk.default.green(`Author: ${json.author}`));
	console.log((''));
	console.log(chalk.default.green('LinkedIn: https://www.linkedin.com/in/jam-batista-98101015b/'));
	console.log(chalk.default.blue('--------------------------------------------------------'));
  })();
  