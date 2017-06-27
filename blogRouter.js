
const express = require('express');
const router = express.Router(); 

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');


BlogPosts.create('Gardening', 'Lots of gardeing tips and tricks' , 'John Smith' , '01/12/17');
BlogPosts.create('Surfing', 'Surfing tips and tricks' , 'Rad Man' , '10/12/15');
BlogPosts.create('Reading', 'Speed reading for all' , 'Fast Sand' , '09/14/14');

router.get('/' , (req , res) => {
	res.json(BlogPosts.get());
});

router.post('/' , jsonParser, (req, res) => {
	const requiredFields = ['title' , 'content' , 'author'];
	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in request body`
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}

  	const item = BlogPosts.create(req.body.title , req.body.content, req.body.author, req.body.publishDate);
  	res.status(201).json(item);
});

router.delete('/:id' , (req , res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted BlogPost item \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id' , jsonParser , (req , res) => {
	const requiredFields = ['title' , 'content' , 'author'];
		for (let i=0; i<requiredFields.length; i++) {
    		const field = requiredFields[i];
    		if (!(field in req.body)) {
      			const message = `Missing \`${field}\` in request body`
      			console.error(message);
      			return res.status(400).send(message);
    		}
  		}
  	if (req.params.id !== req.body.id) {
    	const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    	console.error(message);
    	return res.status(400).send(message);
  	}

  	console.log(`Updating BlogPost item \`${req.params.id}\``);
  	BlogPosts.update({
  		id: req.params.id,
  		title: req.body.title,
  		content: req.body.content,
  		author: req.body.author,
  		publishDate: req.body.publishDate || Date.now()

  	});
  	res.status(204).end();

});


module.exports = router;
