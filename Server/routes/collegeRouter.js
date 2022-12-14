const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
var passport = require('passport');
const authenticate = require('../authenticate');

const Colleges = require('../models/college');
const User = require('../models/user');


var collegeRouter = express.Router();

collegeRouter.use(bodyParser.json());



collegeRouter.route('/')

    .get((req, res, next) => {
        // console.log(req.query)
        Colleges.find({})
            .then((college) => {
                // console.log(college);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.send(college);
            }, (err) => next(err))
            .catch((err) => { next(err) });
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json("Operation Not Supported");
    })

    .post(authenticate.verifyUser, (req, res, next) => {

        req.body.admin = req.user._id;
        Colleges.create(req.body)
            .then((college) => {
                User.findById(req.user._id)
                    .then(user => {
                        user.createdColleges.push(college._id)
                        user.save()
                            .then((clg) => {

                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(college);
                            })
                    })
                // console.log('College Added', college)

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Colleges.remove({})
            .then((college) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(college);
            }).catch((err) => next(err))
    })

collegeRouter.route('/search')
    .post((req, res, next) => {
        console.log(req.body)
        if (req.body.name && req.body.name !== "") {
            let pat = new RegExp("^" + req.body.name, 'i')
            Colleges.find({ name: { $regex: pat } })
                .then((college) => {
                    //console.log(college);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.send(college);
                }, (err) => next(err))
                .catch((err) => { next(err) });
        }
        else {
            res.json([]);
        }

    })



collegeRouter.route('/:collegeId')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {

                // if (authenticate.verifyCollegeAdmin(req.user, college.admin, res))
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json("College Not Found");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(college);
                }
            }).catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json("Operation Not Supported");
    })
    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findByIdAndUpdate(req.params.collegeId, { $set: req.body }, { new: true })
            .then((college) => {
                res.json(college);
            }).catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findByIdAndRemove(req.params.collegeId)
            .then((college) => {
                User.updateMany({ $pull: { followedColleges: req.params.collegeId } })
                    .then(users => {
                        User.findById(req.user._id)
                            .then(user => {
                                user.createdColleges.pull(college._id)
                                user.save()
                                    .then((users) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(user);
                                    })
                            })
                    })
                // User.findById(req.user._id)
                //     .then(user => {
                //         user.createdColleges.pull(college._id)
                //         user.save()
                //             .then((users) => {
                //                 res.statusCode = 200;
                //                 res.setHeader('Content-Type', 'application/json');
                //                 res.json(user.createdColleges);
                //             })
                //     })
            }).catch((err) => next(err))
    })

collegeRouter.route('/:collegeId/isadmin')
    .get(authenticate.verifyUser, (req, res, next) => {

        Colleges.findById(req.params.collegeId)
            .then((college) => {

                // if (authenticate.verifyCollegeAdmin(req.user, college.admin, res))
                if (req.user._id != college.admin) {
                    res.json(false);
                }
                else {
                    res.json(true);
                }
            }).catch((err) => next(err))
    })


collegeRouter.route('/:collegeId/follow')
    .get(authenticate.verifyUser, (req, res, next) => {
        User.findById(req.user._id)
            .then((user) => {
                if (user) {
                    if (user.followedColleges.indexOf(req.params.collegeId) === -1) {
                        user.followedColleges.push(req.params.collegeId)
                        user.save()
                            .then((user) => {
                                Colleges.findByIdAndUpdate(req.params.collegeId, { $inc: { followers: 1 } }, { new: true })
                                    .then((college) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ "user": user, "college": college });
                                    })
                            }, err => next(err))
                    }
                    else {
                        user.followedColleges.pull(req.params.collegeId)
                        user.save()
                            .then((user) => {
                                Colleges.findByIdAndUpdate(req.params.collegeId, { $inc: { followers: -1 } }, { new: true })
                                    .then((college) => {
                                        console.log(college)
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({ "user": user, "college": college });
                                    })
                            }, err => next(err))
                    }
                }
            })
    })




collegeRouter.route('/:collegeId/SliderImage')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { imageList: 1 })
            .then(college => {
                if (college != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(college.imageList);
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {

        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {

                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json')
                    res.json('College Not Found');
                }
                else {
                    college.imageList.push(req.body)
                    college.save()
                        .then((college) => {
                            if (college) {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(college.imageList);
                            }
                        }, err => next(err)
                        ).catch((err) => next(err))
                }
            }).catch((err) => next(err))
    })
    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json("Operation Not Supported");
    })
    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {

        Colleges.findByIdAndUpdate(req.params.collegeId, { imageList: [] })
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'application/json');

                    res.json('College Not Found');
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    console.log("All the images are deleted successfuly");
                    res.json(college.imageList);
                }
            }, (err) => next(err))
    })


collegeRouter.route('/:collegeId/SliderImage/:slideId')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {

                    if (college.imageList.id(req.params.slideId)) {

                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(college.imageList.id(req.params.slideId))

                    }
                    else {

                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Image Not Found");
                    }

                }
            })
    })
    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json("Operation Not Supported");
    })
    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {

        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    if (req.body.url) {
                        if (college.imageList.id(req.params.slideId)) {

                            college.imageList.id(req.params.slideId).url = req.body.url;
                            college.save()
                                .then((college) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(college.imageList)
                                }).catch((err) => next(err))
                        }
                        else {
                            res.statusCode = 404;
                            res.setHeader("Content-Type", "application/json")
                            res.json("Image Not Found");

                        }

                    }
                    else {
                        res.statusCode = 403;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Invalid update field");
                    }

                }
            }).catch((err) => next(err))

    })
    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    if (college.imageList.id(req.params.slideId)) {

                        college.imageList.id(req.params.slideId).remove()
                        college.save()
                            .then((college) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(college.imageList)
                            }).catch((err) => next(err))
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Invalid Image Id");
                    }

                }
            }).catch((err) => next(err))
    })
/* err = new Error('About' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err); */
collegeRouter.route('/:collegeId/posts')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {

                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(college.posts);
                }
            }).catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {

        console.log("HERe1");
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                console.log("HERe2");
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {

                    college.posts.push(req.body)
                    college.save()
                        .then((college) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.posts);
                        }).catch((err) => next(err))
                }
            }).catch((err) => next(err))

    })
    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        err = new Error("Operation Not Supported");
        err.statusCode = 403;
        return next(err);
    })
    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {

        Colleges.findByIdAndUpdate(req.params.collegeId, { posts: [] })
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    console.log("All the posts are deleted successfuly");
                    res.json(college.posts);
                }
            }, (err) => next(err))
    })

collegeRouter.route("/:collegeId/posts/:postId")
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("Post Not Found");
                }
                else {
                    if (college.posts.id(req.params.postId)) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(college.posts.id(req.params.postId))
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Post Not Found");

                    }
                }
            }).catch((err) => next(err))
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        console.log("Here")
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    if (req.body.caption) {

                        if (college.posts.id(req.params.postId)) {
                            college.posts.id(req.params.postId).caption = req.body.caption;

                            college.save()
                                .then((college) => {
                                    res.statusCode = 200;
                                    res.setHeader("Content-Type", "application/json");
                                    res.json(college.posts)
                                })

                        }
                        else {

                            res.statusCode = 404;
                            res.setHeader("Content-Type", "application/json")
                            res.json("Posts Not Found");

                        }

                    }
                    else {

                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Invalid Update Feild");

                    }

                }
            }).catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    err = new Error("College Not Found");
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    if (college.posts.id(req.params.postId)) {

                        college.posts.id(req.params.postId).remove()
                        college.save()
                            .then((college) => {
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "application/json");
                                res.json(college.posts)
                            }).catch((err) => next(err))

                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("Post Not Found");

                    }
                }
            }).catch((err) => next(err))
    })


collegeRouter.route("/:collegeId/posts/:postId/like")

    .get(authenticate.verifyUser, (req, res, next) => {
        var isLiked;
        Colleges.findById(req.params.collegeId)
            .then((college) => {

                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }

                if (college.posts.id(req.params.postId)) {
                    console.log("Here")
                    if (college.posts.id(req.params.postId).likedUser.includes(req.user._id)) {
                        college.posts.id(req.params.postId).likedUser.pull(req.user._id)
                        college.posts.id(req.params.postId).likes -= 1;
                        isLiked = true;
                    }

                    else {
                        college.posts.id(req.params.postId).likedUser.push(req.user._id)
                        college.posts.id(req.params.postId).likes += 1;
                        isLiked = false;
                    }


                    college.save()
                        .then((college) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json({
                                "likes": college.posts.id(req.params.postId).likes,
                                "isLiked": isLiked
                            })
                        })

                }
                else {

                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("Posts Not Found");

                }
            }).catch((err) => next(err))
    })
//GET /college/6221b844b29fdd64c3e59045/posts/62264dce190f886ffcfb1203/isLiked 304 202.285 ms - -
collegeRouter.route("/:collegeId/posts/:postId/isLiked")

    .get(authenticate.verifyUser, (req, res, next) => {
        // console.log("Working")
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                const isLiked = [];
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }

                if (college.posts.id(req.params.postId)) {
                    console.log(college.posts.id(req.params.postId).likedUser)
                    if (college.posts.id(req.params.postId).likedUser.indexOf(req.user._id) !== -1) {
                        isLiked.push(true);
                    }

                    else {
                        isLiked.push(false);
                    }


                    college.save()
                        .then((college) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(isLiked[0])
                        })

                }
                else {

                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("Posts Not Found");

                }


            }).catch((err) => next(err))

    })


collegeRouter.route('/:collegeId/about')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { aboutUs: 1, _id: 0 })
            .then(college => {
                if (college != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(college.aboutUs);
                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT opration is not supported on /colleges' + req.params.collegeId + '/about');
    })


    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    college.aboutUs.push(req.body);
                    college.save()
                        .then(college => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.aboutUs);
                        })

                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    college.aboutUs = []
                    college.save()
                        .then(college => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.aboutUs);
                        })
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })


collegeRouter.route('/:collegeId/about/:aboutId')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { aboutUs: 1, _id: 0 })
            .then(college => {
                if (college != null) {
                    if (college.aboutUs.id(req.params.aboutId) != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(college.aboutUs.id(req.params.aboutId));
                    }
                    else {
                        err = new Error('About ' + req.params.aboutId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }


                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { aboutUs: 1, id: 1 })
            .then(college => {
                if (college != null) {
                    if (college.aboutUs.id(req.params.aboutId) != null) {
                        if (req.body.imageUrl) {
                            college.aboutUs.id(req.params.aboutId).imageUrl = req.body.imageUrl;
                        }
                        if (req.body.title) {
                            college.aboutUs.id(req.params.aboutId).title = req.body.title;
                        }
                        if (req.body.description) {
                            college.aboutUs.id(req.params.aboutId).description = req.body.description;
                        }
                        college.save((err, college) => {
                            if (err) {
                                next(err)
                            }
                            else {
                                Colleges.findById(college._id, { aboutUs: 1 })
                                    .then(college => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(college.aboutUs);
                                    })
                            }
                        })
                    }


                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            })
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST opration is not supported on /colleges' + req.params.collegeId + '/about/' + req.params.aboutId);
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { aboutUs: 1 })
            .then(college => {
                if (college != null) {
                    if (college.aboutUs.id(req.params.aboutId) != null) {
                        college.aboutUs.id(req.params.aboutId).remove();
                        college.save()
                            .then(college => {
                                Colleges.findById(college._id, { aboutUs: 1 })
                                    .then(college => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(college.aboutUs);
                                    })
                            })
                    }
                    else {
                        err = new Error('About ' + req.params.aboutId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }

                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            })
    })

collegeRouter.route('/:collegeId/notices/ids')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { 'notices._id': 1 })
            .then(college => {
                if (college != null) {
                    // college.notices.find({})
                    // .then(notices => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(college);
                    // }) 
                }
                else {
                    err = new Error('Notice' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

collegeRouter.route('/:collegeId/notices')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1, _id: 0 })
            .then(college => {
                if (college != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(college.notices);
                }
                else {
                    err = new Error('Notice' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT opration is not supported on /colleges' + req.params.collegeId + '/about');
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    // console.log(req.body);
                    college.notices.push(req.body);
                    college.save()
                        .then(college => {
                            Colleges.findById(college._id, { notices: 1, _id: 0 })
                                .then(college => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(college.notices);
                                })

                        })
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    college.notices = [];
                    college.save()
                        .then(college => {
                            Colleges.findById(college._id, { notices: 1, _id: 0 })
                                .then(college => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(college.notices);
                                })
                        })
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

collegeRouter.route('/:collegeId/notices/:noticeId')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {
                if (college != null) {
                    // console.log(college.notices.id(req.params.noticeId))
                    if (college.notices.id(req.params.noticeId) != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(college.notices.id(req.params.noticeId));
                    }
                    else {
                        err = new Error('Notice Block ' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }


                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {
                if (college != null) {
                    if (college.notices.id(req.params.noticeId) != null) {

                        if (req.body.noticeTitle) {
                            college.notices.id(req.params.noticeId).noticeTitle
                                = req.body.noticeTitle;
                        }
                        console.log(req.body);
                        if (req.body.isPinned === true || req.body.isPinned === false) {
                            console.log("Working01");
                            college.notices.id(req.params.noticeId).isPinned
                                = !req.body.isPinned;

                            console.log(college.notices.id(req.params.noticeId).isPinned)
                            // res.json(college.notices.id(req.params.noticeId));

                            // console.log(college.notices.id(req.params.noticeId).isPinned)
                        }
                        college.save((err, college) => {
                            if (err) {
                                next(err)
                            }
                            else {
                                Colleges.findById(college._id, { notices: 1 })
                                    .then(college => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(college.notices);
                                    })
                            }
                        })
                    }
                    else {

                    }

                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            })
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST opration is not supported on /colleges' + req.params.collegeId + '/notices/' + req.params.noticeId);
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {
                if (college != null) {
                    if (college.notices.id(req.params.noticeId) != null) {
                        college.notices.id(req.params.noticeId).remove();
                        college.save()
                            .then(college => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(college.notices);
                            })
                    }
                    else {
                        err = new Error('Notice Block ' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }

                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            })
    })


collegeRouter.route('/:collegeId/notices/:noticeId/pinNotice')
    .post((req, res, next) => {

        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college !== null) {
                    if (college.notices.id(req.params.noticeId) != null) {
                        if (college.notices.id(req.params.noticeId).isPinned)
                            college.notices.id(req.params.noticeId).isPinned = false;
                        if (!college.notices.id(req.params.noticeId).isPinned)
                            college.notices.id(req.params.noticeId).isPinned = true;
                        console.log(college.notices.id(req.params.noticeId).isPinned);

                    }
                    res.json(college.notices.id(req.params.noticeId));
                }

            }).catch((err) => next(err))
    })

collegeRouter.route('/:collegeId/notices/:noticeId/notice')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1, _id: 0 })
            .then(college => {
                if (college !== null) {
                    if (college.notices !== null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(college.notices.id(req.params.noticeId).notice);
                    }
                    else {
                        err = new Error('Notice Block' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT opration is not supported on /colleges' + req.params.collegeId + '/notices');
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    // console.log(req.body);
                    college.notices.id(req.params.noticeId).notice.push(req.body);
                    college.save()
                        .then(college => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.notices);
                        })
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then(college => {
                if (college != null) {
                    college.notices.id(req.params.noticeId).notice = [];
                    college.save()
                        .then(college => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.notices);
                        })
                }
                else {
                    err = new Error('College' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })

collegeRouter.route('/:collegeId/notices/:noticeId/notice/:docId')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {
                if (college != null) {
                    if (college.notices.id(req.params.noticeId) != null) {
                        if (college.notices.id(req.params.noticeId).
                            notice.id(req.params.docId) != null) {

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.notices.id(req.params.noticeId).
                                notice.id(req.params.docId));
                        }
                        else {
                            err = new Error('Notice ' + req.params.docId +
                                ' not found');
                            err.statusCode = 404;
                            return next(err);
                        }
                    }
                    else {
                        err = new Error('Notice Block ' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => { console.log(err) })
    })

    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {

                if (college != null) {
                    if (college.notices.id(req.params.noticeId) !== null) {
                        if (college.notices.id(req.params.noticeId).
                            notice.id(req.params.docId) !== null) {

                            if (req.body.description) {
                                college.notices.id(req.params.noticeId).
                                    notice.id(req.params.docId).description = req.body.description;
                            }
                            if (req.body.noticeLink) {
                                college.notices.id(req.params.noticeId).
                                    notice.id(req.params.docId).noticeLink = req.body.noticeLink;
                            }
                            college.save((err, college) => {
                                if (err) {
                                    next(err)
                                }
                                else {
                                    Colleges.findById(college._id, { notices: 1 })
                                        .then(college => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(college.notices);
                                        })
                                }
                            })
                        }
                        else {
                            err = new Error('Notice ' + req.params.docId +
                                ' not found');
                            err.statusCode = 404;
                            return next(err);
                        }
                    }
                    else {
                        err = new Error('Notice Block ' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            })
    })

    .post(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST opration is not supported on /colleges' + req.params.collegeId + '/notices/' + req.params.noticeId + "/notice/" + docId);
    })

    .delete(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        Colleges.findById(req.params.collegeId, { notices: 1 })
            .then(college => {
                if (college != null) {
                    if (college.notices.id(req.params.noticeId) != null) {
                        college.notices.id(req.params.noticeId).notice.id(req.params.docId).remove();
                        college.save()
                            .then(college => {
                                Colleges.findById(college._id, { notices: 1 })
                                    .then(college => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(college.notices);
                                    })
                            })
                    }
                    else {
                        err = new Error('Notice Block ' + req.params.noticeId +
                            ' not found');
                        err.statusCode = 404;
                        return next(err);
                    }

                }
                else {
                    err = new Error('College ' + req.params.collegeId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }
            })
    })

collegeRouter.route('/:collegeId/academics')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(college.Academics)
                }
                else {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
            })
    })
    .post((req, res, next) => {
        // console.log("Heree")
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college !== null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    console.log(req.body);
                    college.Academics.push(req.body);
                    college.save()
                        .then((college) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(college.Academics);
                        }).catch((err) => next(err))
                }
                else {
                    // res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
            })
    })
    .put(authenticate.verifyUser, authenticate.verifyCollegeAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT opration not supported');
    })

    .delete((req, res, next) => {
        Colleges.findByIdAndUpdate(req.params.collegeId, { Academics: [] })
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    console.log("All the Course are deleted successfuly");
                    res.json(college.posts);
                }
            }, (err) => next(err))


    })
collegeRouter.route('/:collegeId/academics/:academicID')
    .get((req, res, next) => {
        Colleges.findById(req.params.collegeId)
            .then((college) => {
                if (college === null) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");
                }
                else {
                    if (college.Academics.id(req.params.academicID)) {

                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(college.Academics.id(req.params.academicID))
                    }
                    else {

                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json")
                        res.json("College Not Found");

                    }
                }
            })
    })
    .post((req,res,next)=>{
        res.statusCode = 403;
        res.end('Post opration not supported');
    })
    .put((req,res,next)=>{
        Colleges.findById(req.params.collegeId)
        .then((college) => {
            if (college === null) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json")
                res.json("College Not Found");
            }
            else {
                if (college.Academics.id(req.params.academicID)) {

                    if(req.body.courseName)
                    {
                        college.Academics.id(req.params.academicID).courseName=req.body.courseName;
                    }
                    
                    if(req.body.courseDescription)
                    {
                        college.Academics.id(req.params.academicID).courseDescription=req.body.courseDescription;
                    }
                    if(req.body.fees)
                    {
                        college.Academics.id(req.params.academicID).fees=req.body.fees;
                    }
                    
                    if(req.body.imageUrl)
                    {
                        college.Academics.id(req.params.academicID).imageUrl=req.body.imageUrl;
                    }
                    
                    if(req.body.duration)
                    {
                        college.Academics.id(req.params.academicID).duration=req.body.duration;
                    }
                    college.save((err, college) => {
                        if (err) {
                            next(err)
                        }
                        else {
                            Colleges.findById(college._id, { Academics: 1 })
                                .then(college => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(college.Academics.id(req.params.academicID));
                                })
                }
            })
        }
                else {

                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json")
                    res.json("College Not Found");

                }
            }
        })
    })
    .delete((req,res,next)=>{
        Colleges.findById(req.params.collegeId)
        .then(college => {
            if (college !== null) {
                if (college.Academics.id(req.params.academicID)) {
                    college.Academics.id(req.params.academicID).remove();
                    college.save()
                        .then(college => {
                            Colleges.findById(college._id, { Academics: 1 })
                                .then(college => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(college.Academics);
                                })
                        })
                }
                else {
                    err = new Error('About ' + req.params.aboutId +
                        ' not found');
                    err.statusCode = 404;
                    return next(err);
                }

            }
            else {
                err = new Error('College ' + req.params.collegeId +
                    ' not found');
                err.statusCode = 404;
                return next(err);
            }

        })

    })



module.exports = collegeRouter;
