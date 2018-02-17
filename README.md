
# ePart Open Civic Engagement Platform

Live site at [https://beta.epart.co.il](https://beta.epart.co.il)
## Technologies

* App server is built with node.js [Loopback framework](https://loopback.io/)

* Client side is built with Angular 1.X

## Installation

### Dependencies

* Installation depends on `node`/`npm` with `grunt` and `bower` installed globally.

    $ npm install -g bower grunt-cli

## The steps to Install: 

### Checkout the project:

    git clone https://github.com/e-part/epart-app.git

### Install the packages:

    npm install
    
    bower install
 

### Setup a database

* You need to have a local instance of MySQL running for the server to connect to.

* Setup the `db` connection details in the `datasources.json` file.

* Init DB tables:

      npm run start_db

### Setup storage

* In order to save media files you'll need to setup a storage account. 
To configure this, you'll need to setup a datasource for your storage in the `datasources.json`, and then connect
it to the Container model in the `model-config.json`.
Look at the Loopback [documentation](https://loopback.io/doc/en/lb2/Storage-component.html) for details.

* Next, the project uses Cloudinary service for fast delivery of images. Create an account and fill in the 
settings in the `config.json` file under `cloudinary`

### Setup Email Service

* This project is using Mailchimp to add a newsletter list support for the platform. 
You'll need to open an account and put your credentials in `component-config.json` file under `loopback-component-mailchimp`.

* This project is using [Mandrill](https://mandrillapp.com) by MailChimp as it's customized emails service. 
In order to use it, you'll need to put your Mailchimp account API key in the `datasources.json` file under `mandrill`.

* Once this is done, you can setup your customized email templates (see below).


### Setup Third-party Login Integrations (Optional)

 * Add a providers.<env>.json file based on providers.template.json file.
 
 * In the index.tpl.html, uncomment the Facebook script tag, and insert your app ID.
 
### Google Analytics (Optional)

 * in the index.tpl.html, uncomment the Google Analytics script tag, and insert your analytics account ID.

### Build the client:

    grunt build   
    
## Running


### Server

To run the server you issue the command:

    npm start


## Client

To run the client you issue the command.

    grunt dev

This will open the project in your default browser with livereload enabled.
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
    
## Email templates

In order to enable emails sending you'll need to setup the email templates using the Mandrill service. 
This is still a work in progress, so if you'd like to enable this feature, please contact me (yotamsha@gmail.com).

## API Security

To access models with access control enable you need an AccessToken. You can get an access token by logging in to the API.

## Development

If you want to share your work through a Pull Request, be sure to make it a clean branch (one functionality per PR) and base it off master.

If you plan on making a big change or replace a core function with something else it is probably best to first open an issue to discuss it with me. This will enhance the chance of the eventual changes getting merged a lot :)

## Server Integration Testing using Mocha/Jasmine

        npm test

# Issues

If you have any problems please [contact me](https://github.com/e-part/epart-app/issues/new).

# Credits

The project is based on [Loopback Angular Admin](https://github.com/colmena/colmena).
