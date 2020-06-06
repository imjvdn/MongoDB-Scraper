// Require all models
var db = require('../models');
var axios = require('axios');
var cheerio = require('cheerio');

module.exports = function (app) {
  app.get('/api/scrape', function (req, res) {
    //     axios.get('https://www.espn.com/').then(function (response) {
    //       // Then, we load that into cheerio and save it to $ for a shorthand selector
    //       var $ = cheerio.load(response.data);

    //       // Save an empty result array
    //       var result = {};
    //       $('.quickLinks__list').each(function (i, element) {
    //         result.title = $(this).text();
    //         result.link = $(this).find('a').attr('href');
    //         result.summary = $(this).find('p').text();
    //         db.Article.remove({}, function (err) {
    //           if (err) {
    //             console.log(err);
    //           } else {
    //             res.end('success');
    //           }
    //         });
    //         db.Article.create(result)
    //           .then(function (dbArticle) {
    //             console.log(dbArticle);
    //           })
    //           .catch(function (err) {
    //             console.log(err);
    //           });
    //       });
    //     });
    //   });

    axios.get('https://www.nytimes.com').then(function (response) {
      var $ = cheerio.load(response.data);
      var count = 0;
      $('article').each(function (i, element) {
        count++;
        var result = {};
        result.title = $(this).text();
        result.link = $(this).find('a').attr('href');
        result.summary = $(this).find('p').text();
        result.saved = $(this).saved = false;
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    });
  });

  app.get('/api/articles', function (req, res) {
    db.Article.find({})
      .then(function (dbArticle) {
        res.send(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/articles', function (req, res) {
    db.Article.remove({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/saved', function (req, res) {
    db.Save.remove({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/notes', function (req, res) {
    db.Note.remove({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get('/api/saved', function (req, res) {
    db.Save.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get('/api/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get('/api/saved/:id', function (req, res) {
    db.Save.findOne({ _id: req.params.id })
      .populate('note')
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/articles/:id', function (req, res) {
    db.Article.remove({ _id: req.params.id })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/notes/:id', function (req, res) {
    db.Note.remove({ _id: req.params.id })
      .then(function (dbNote) {
        res.json(dbNote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete('/api/saved/:id', function (req, res) {
    db.Save.remove({ _id: req.params.id })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post('/api/saved', function (req, res) {
    console.log(req.body);

    var result = {};

    result.title = req.body.title;
    result.link = req.body.link;
    result.summary = req.body.summary;

    db.Save.create(result)
      .then(function (dbSaved) {
        console.log(dbSaved);
      })
      .catch(function (err) {
        console.log(err);
      });
  });

  app.get('/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })

      .populate('note')
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.post('/api/notes/:id', function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Save.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
};
