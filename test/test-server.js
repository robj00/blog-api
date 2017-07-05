const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');



chai.use(chaiHttp);

describe ('Entries' , function() {


	before(function() {
      return runServer();
  	});

	after(function() {
    	return closeServer();
  	});

	it('should display blog enties on GET', function(done) {
		chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.above(0);
			res.body.forEach(function(item){
				item.should.be.a('object');
				item.should.have.all.keys(
					'id', 'title' , 'content' , 'author' , 'publishDate');
			});
      done();
		});
	});

 it('should add an item on POST', function() {
    const newItem = {
      title: 'New Age Ben Hur',
      content: 'The hip summary of that boring novel',
      author: 'JS Hipster',
      publishDate: '12/15/2016'
    };
    return chai.request(app)
      .post('/blog-posts')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('title', 'content', 'author', 'id' , 'publishDate');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });


  it('should update items on PUT', function() {
   
    

    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        const updateData = {
          title: 'Ben Hur Post',
          content: 'Summary of that book, very opinionated',
          author: 'John Smith'
        };
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
     
      .then(function(res) {
        res.should.have.status(204);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
     
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });

});

