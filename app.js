//loads all dependencies
const path = require('path');
const fs = require('fs');
const yargs = require('yargs')
const chalk = require('chalk');

//if no arguments are entered
if(yargs.argv._.length == 0){
    console.log(chalk.yellow('Welcome to the notes app. You can create your notes with all types of crud operation here. See the commands below to get started'));
    console.log(chalk.cyan('To add a note type the following command'))
    console.log(chalk.magenta('node app.js add --title=\"Enter a title\" --body=\"Enter the body\" --note=\"Enter the name of the note\"'));
    console.log(chalk.cyan('To remove a note type the following command'))
    console.log(chalk.magenta('node app.js remove --name\"Name of the note\"'));
    console.log(chalk.cyan('To list all your notes type the following command'))
    console.log(chalk.magenta('node app.js list'));
    console.log(chalk.cyan('To read a note following command'))
    console.log(chalk.magenta('node app.js read --name=\"Enter the name of the note\"'));
}

//adds a new command for adding a note
yargs.command({
    command: 'add',
    describe: 'Adds a new note',
    builder: {
        title: {
            describe: 'Title of the note',
            demandOption: true,
            type: 'string'
        },
        name: {
            describe: 'Name for the note',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Body of the note',
            demandOption: true,
            type: 'string'
        },
    },
    handler: async function(argv){
        var note = {
            title: argv.title,
            body: argv.body
        };
        console.log(chalk.green('Adding a new note!'));
        console.log(chalk.blue('Note name:', argv.name));
        console.log(chalk.yellow('Title:', argv.title))
        console.log(chalk.yellow('Body:', argv.body));
        try {
            await fs.writeFileSync(path.join(__dirname, 'data', argv.name + '.json'), JSON.stringify(note));
            console.log(chalk.green('Added a new note!'));
        } catch (error) {
            console.log(chalk.red('Operation failed',error));   
        }
    }
})

//adds a new command for removing a note
yargs.command({
    command: 'remove',
    describe: 'Removes an exisiting note',
    builder: {
        name: {
            describe: 'Name for the note',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function(argv){
        console.log(chalk.green('Removing the note!'));
        console.log(chalk.blue('Note name:', argv.name));
        try {
            await fs.unlinkSync(path.join(__dirname, 'data', argv.name + '.json'));
            console.log(chalk.green('Removed the note!'));
        } catch (error) {
            console.log(chalk.red('Operation failed.', error));   
        }
    }
})

//adds a new command for giving the list of notes
yargs.command({
    command: 'list',
    describe: 'Gives a list of your notes',
    handler: function(){
        fs.readdir(path.join(__dirname, 'data'), (error, files) => {
            if(error){
                console.log(chalk.red('Operation failed',error))
            } else {
                console.log(chalk.green("List of your notes:"));
                files.forEach(item => {
                    console.log(chalk.blue(item));
                })
            }
        });
    }
})

//adds a new command for reading a note
yargs.command({
    command: 'read',
    describe: 'Reads a specific note',
    builder: {
        name: {
            describe: 'The name of the note',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv){
        var note;
        console.log(chalk.green('Reading the note!'));
        console.log(chalk.blue('Note name:', argv.name));
        note = fs.readFile(path.join(__dirname, 'data', argv.name + '.json'), (error, data) => {
            if(error){
                console.log(chalk.red('Operation failed', error)); 
            } else {
                var parsedNote = JSON.parse(data);
                note = {
                    title: parsedNote.title,
                    body: parsedNote.body
                }
                console.log(chalk.magenta('Title:', note.title));
                console.log(chalk.magenta('Body:', note.body));
                console.log(chalk.green('Read note!'));
            }
        });
    }
})

//parses all the commands
yargs.parse();
