const FB = require('fb')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const User = require('../models/user')
const Task = require('../models/task')


class userCtrl {
    static loginFb(req,res) {
        console.log(req.body.accessToken)
        // FB.setAccessToken(req.headers.accesstoken);
        console.log('masuk')
        // res.send(req.body)
        FB.api('me', { fields: ['id', 'name','email'], access_token: req.body.accessToken }, function (response) {
            console.log(response);
            User.find({email:response.email})
            .then((users,err) => {
                if(err) return res.send(err)

                if(users.length == 0) {
                    var newUser = new User({
                        username: response.name,
                        email: response.email,
                        fb: true
                    })

                    newUser.save()
                    .then((result,err) => {
                        var token = jwt.sign(result,'todo')
                        
                        res.send(token)
                    })
                } else {
                    console.log(users)
                    var token = jwt.sign({
                        _id: users[0]._id,
                        username: users[0].username,
                        emai: users[0].email
                    }, 'todo')

                    // var token = jwt.sign({
                    //     _id: 'asdlkasmdasd',
                    //     username: 'Jason Effendi',
                    //     emai: 'jason@mailinator.com'
                    // }, 'todo')
                    console.log(token)
                    res.send(token)
                }
            })
        });
    }

    static hasLogin(req,res) {

    }

    static get(req,res) {
        User.find({})
        .then((user,err) => {
          if(err) {
            res.send(err)
          }
          res.send({
              message: 'user list has been loaded',
              list: user
          })
        })
    }

    static list(req,res) {
        var opentoken = jwt.verify(req.query.token, 'todo')
        Task.find({user: opentoken._id})
        .then((result, err) => {
            if(err) return res.send(err)

            res.send(result)
        })
    }

    static post(req,res) {
        var opentoken = jwt.verify(req.body.token, 'todo')
        console.log(opentoken)
        if(req.body.post !== '') {
            var task = new Task({
                user: opentoken._id,
                description: req.body.task 
            })

        // res.send(task)    
            task.save()
            .then((result,err) => {
                if(err) return res.send(err)
                console.log(result)
                res.send(result)
            })
        }
    }

    static done(req,res) {
        Task.findOneAndRemove({_id: req.params.id})
        .then((task,err) => {
            if(err) return res.send(err)

            res.send(task)
        })
    }

    static update(req,res) {
        if(req.body.name === '' || req.body.name !== undefined) {
            User.findOneAndUpdate({_id: req.params.id},{
                description: req.body.task
            })
            .then((user,err) => {
                if(err) return res.send(err)

                res.send({
                    message: 'user has been updated',
                    user: user
                })
            })
        }
    }

    static delete(req,res) {
        User.findOneAndRemove({_id: req.params.id})
        .then((user,err) => {
            if(err) return res.send(err)
            
            res.send({
                message: 'user has been deleted',
                user: user
            })
        })
    }
}

module.exports = userCtrl