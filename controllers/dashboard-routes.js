const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

//GET
// the user dashboard will show all of the posts from the logged in user
router.get('/', withAuth, (req, res) => {
    Post.findAll({
      where: {
        user_id: req.session.user_id
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
                        'created_at'
                    ],
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
    //serializes the raw data from the db
    // renders it to the dashboard template
      .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('dashboard', { posts, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//GET
// repeats the dashboard process for the edit page
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
    where: {
    id: req.params.id
    },
    attributes: ['id', 
                'post_text', 
                'title',
                'created_at'
            ],
    include: [
    {
        model: User,
        attributes: ['username']
    },
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
    }
    ]
})
.then(dbPostData => {
  if (!dbPostData) {
    res.status(404).json({ message: ' Try again. No post found with this id' });
    return;
  }

  // serialize the data
  const post = dbPostData.get({ plain: true });

  res.render('edit-post', {
      post,
      loggedIn: true
      });
})
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});

router.get('/create/', withAuth, (req, res) => {
Post.findAll({
where: {
  // use the ID from the session
  user_id: req.session.user_id
},
attributes: [
            'id', 
            'post_text', 
            'title',
            'created_at'],
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
    attributes: ['username',]
  }
]
})
.then(dbPostData => {
  // serialize data before passing to template
  const posts = dbPostData.map(post => post.get({ plain: true }));
  res.render('create-post', { posts, loggedIn: true });
})
.catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});


module.exports = router;