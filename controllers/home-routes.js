const { Post, User, Comment } = require('../models');
const router = require('express').Router();
const sequelize = require('../config/connection');

//GET
// all posts will be shown on the homepage
router.get('/', (req, res) => {
    console.log(req.session);

    Post.findAll({
        attributes: [
          'id',
          'post_text',
          'title',
          'created_at'
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 
                        'comment_text', 
                        'post_id', 
                        'user_id', 
                        'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
          // serialize
          const posts = dbPostData.map(post => post.get({ plain: true }));
          res.render('homepage', { posts, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });
// GET 
// after logging in,
//redirect to the home page
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return; 
    }
    res.render('login');
});

//GET
// route to the sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

//GET
//route to individual post
router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 
                        'comment_text', 
                        'post_id', 
                        'user_id', 
                        'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'Try again. No post found.' });
          return;
        }

    //serialize    
        const post = dbPostData.get({ plain: true });
        res.render('single-post', { post, loggedIn: req.session.loggedIn});
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router; 