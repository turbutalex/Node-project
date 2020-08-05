const path = require('path');
const auth = require('http-auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});
const {check, validationResult} = require('express-validator');
//Registration.collection.dropIndex ("email");
router.get('/', (req, res) => {
    res.render('form', {title: 'Sign up'});
});
router.post('/',
    [
        check('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
        check('password')
            .isLength({min: 1})
            .withMessage('Please enter a password'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {


            const registration = new Registration(req.body);
            registration.save()
                .then(() => {
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log(err);
                    res.send('Sorry! Something went wrong.');
                });


        } else {
            res.render('form', {
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
            });
        }
    }
);
router.get('/homepage', basic.check((req, res) => {
    Registration.find()
        .then((registrations) => {
            res.render('index', {title: 'the list of our members', registrations});
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.');
        });
}));

router.get('/login', (req, res) => {
    res.render('logi', {title: 'Login Screen'});

});



router.post('/login',
    [
        check('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
        check('password')
            .isLength({min: 1})
            .withMessage('Please enter a password'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            Registration.find({name: req.body.name, password: req.body.password})
                .then((findResult) => {
                    console.log(findResult);
                    if(findResult.length>0 )
                    {
                        res.redirect('/homepage');


                    }
                    else
                    {
                        res.send('Sorry something went wrong');
                    }



                })
                /*.catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');
            });*/



        } else {
            res.render('logi', {
                title: 'Login Screen',
                errors: errors.array(),
                data: req.body,
            });
        }
    }
);

module.exports = router;