/**
 * Created with JetBrains WebStorm.
 * User: aboujraf
 * Date: 12/08/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */
/*
 * GET home page.
 */

'use strict';


var appConfig = require('../config/appConfig.json');

module.exports = function (app) {
    app.get('/', function (req, res) {

        console.log('inside app.get("/")');

        res.render('index', {
            pageTitle: 'Boilerplate Windows 8, NodeJS, bootstrappage.com ',
            appConfig : appConfig,
            activeNavbar: 'Home',
            rootBootstrap : '/templates/w8_admin/'

        });
    });
};