const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');
var authenticate = require('../authenticate');
const favoriteRouter = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        if (favs) {
            const userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
            if (!userFavs) {
                var err = new Error('You don\'t have favorite dishes !');
                err.status = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favs);
        }
        if (!favs) {
            var err = new Error('No favorites dishes');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        let userFavs;
        if (favs) {
            userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
        }
        if (!userFavs) {
            userFavs = new Favorites({ user: req.user.id });
        }
        for (let i in req.body) {
            if(!userFavs.dishes.find((dish) => {
                if(dish._id)
                    return dish._id.equals(i._id);
            }))
            continue;
            userFavs.dishes.push(i._id)
        }
        user.save()
            .then((userFavs) => {
                console.log('Favorite dishes added ', userFavs);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFavs);
            }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        const userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
        if (userFavs) {
            userFavs.remove()
                .then((done) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(done);
            }, (err) => next(err));
        } else {
            var err = new Error('You don\'t have favorite dishes !');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/favorites/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        if (favs) {
            const userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
            const selectedDish = userFavs.filter(dish => dish.id === req.params.dishId);
            if (!selectedDish) {
                var err = new Error('You don\'t have favorite dishes !');
                err.status = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(selectedDish);
        }
        if (!favs) {
            var err = new Error('No favorites');
            err.status = 404;
               return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        let userFavs;
        if (favs) {
            userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
        }
        if (!userFavs) {
            userFavs = new Favorites({ user: req.user.id });
        }
        if(!userFavs.dishes.find((dish) => {
            if(dish._id)
                return dish._id.equals(req.params.dishId);
        }))
        userFavs.dishes.push(req.params.dishId)
        user.save()
            .then((userFavs) => {
                console.log('Dish added ', userFavs);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(userFavs);
            }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favs) => {
        const userFavs = favs.filter(fav => fav.user._id.equals(req.user.id));
        const selectedDish = userFavs.filter(fav => fav.user._id.equals(req.params.dishId))
        if (selectedDish) {
            selectedDish.remove()
                .then((done) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(done);
            }, (err) => next(err));
        } else {
            var err = new Error('You don\'t have this dish as a favorite !');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
});

module.exports = favoriteRouter;