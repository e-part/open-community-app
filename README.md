
# ePart App


## Installation

### Dependencies

* Installation depends on `node`/`npm` with `grunt` and `bower` installed globally.

    $ npm install -g bower grunt-cli

* You need to have a local instance of MySQL running for the server to connect to. (details below)

## The steps to Install: 

### Checkout the project:

    git clone https://github.com/e-part/epart-app.git

### Install the Node packages:

    npm install

### Build the client:

    grunt build    

### Setup local credentials:

 * Add a providers.json file based on providers.template.json file.
 
## Running


### Server

To run the server you issue the command:

    npm start

### Connect to a database

The project is tested using MySQL, before your run the server, you'll need to start a local database and setup 
the tables first.

## Client

To run the client you issue the command.

    grunt dev

It will open the project in your default browser with livereload enabled.
This will take care of reloading the page when you change your code.

## Features and implemented projects

- Angular UI-Router
- File upload with [LoopBack storage services](https://github.com/strongloop/loopback-component-storage/)
- Bunch of useful filters for AngularJS: [a8m/angular-filter](https://github.com/a8m/angular-filter)
- Social authentication with [LoopBack passport](https://github.com/strongloop/loopback-component-passport/)
- Multi-language support by [rubenv/angular-gettext](https://github.com/rubenv/angular-gettext)
- User management

## Translations

We are using a translations lib called [angular-gettext](https://angular-gettext.rocketeer.be/dev-guide/)
- Download Poedit, that's the software we'll be using to translate the texts.
- First, detect all the locations of changes by running:

      grunt gettext
      
- Then, Open the lang.po file in Poedit, OR if file is already opened in Poedit, choose > Catalog > Update from POT file..
- Translate your texts.
- Run `grunt gettext` again.
    

## API Security

To access models with access control enable you need an AccessToken. You can get an access token by logging in to the API.

## Development

If you want to share your work through a Pull Request, be sure to make it a clean branch (one functionality per PR) and base it off master.

If you plan on making a big change or replace a core function with something else it is probably best to first open an issue to discuss it with me. This will enhance the chance of the eventual changes getting merged a lot :)

## Server Integration Testing using Mocha/Jasmine

        npm test

# Issues

If you have any problems please [contact me](https://github.com/e-part/epart-app/issues/new).
