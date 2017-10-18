/*
|--------------------------------------------------------------------------
|  HapiJS Boom
|--------------------------------------------------------------------------
|
|  Boom provides a set of utilities for returning HTTP errors. Each utility returns a Boom error
|  response object (instance of Error) which includes the following properties:
|
*/
var Boom    = require('boom');


/*
|--------------------------------------------------------------------------
|  HapiJS Joi
|--------------------------------------------------------------------------
|
|  Object schema description language and validator for JavaScript objects.
|
*/
var Joi     = require('joi');


/*
|--------------------------------------------------------------------------
|  HapiJS Joi
|--------------------------------------------------------------------------
|
|  Object schema description language and validator for JavaScript objects.
|
*/
var Path     = require('path');


/*
|--------------------------------------------------------------------------
|  Initialize Server
|--------------------------------------------------------------------------
|
|  Configure Hapi Server
|
*/
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
		port: 8002,
		routes: { cors: { credentials: true } }
});


/*
|--------------------------------------------------------------------------
|  Template Engine
|--------------------------------------------------------------------------
|
|  Template Engine
|
*/
var Handlerbars = require('handlebars');
var HandlebarsLayouts = require('handlebars-layouts');
HandlebarsLayouts.register(Handlerbars);



/*
|--------------------------------------------------------------------------
|  MD5
|--------------------------------------------------------------------------
|
|  MD5 Hashes
|
*/
var md5 = require('md5');


/*
|--------------------------------------------------------------------------
|  HAT
|--------------------------------------------------------------------------
|
|  HAT Module
|
*/
var hat = require('hat');



/*
|--------------------------------------------------------------------------
|  DB
|--------------------------------------------------------------------------
|
|  MongoDB connection
|
*/
var mongojs = require('mongojs')
var db = mongojs("dnnmedia:dnnmedia@dnn.media:37018/dnnmedia")
// var db = mongojs("localhost:27017/dnnmedia")


/*
|--------------------------------------------------------------------------
|  Cleans ObjectId
|--------------------------------------------------------------------------
|
|  Perpares ObjectID
|
*/
var cleanObjectId = function(objectid) {
		var objectid = typeof objectid === "string" ? objectid : ""
		return objectid.length >=12 && objectid.length <=24 ? objectid : "000000000000";
};

/*
|--------------------------------------------------------------------------
|  Verify Token
|--------------------------------------------------------------------------
|
|  Checks if token corresponds to user
|
*/
var verifyToken = function(request, callback) {
		db.collection("AlphaUser").findOne({token: request.payload.token, _id: mongojs.ObjectId( cleanObjectId(request.payload._id) )}, function(error, dbUser) {
				typeof callback === "function" ? callback(!error && dbUser, dbUser) : null;
		})
};

/*
|--------------------------------------------------------------------------
|  View
|--------------------------------------------------------------------------
|
|  View Configuration
|
*/
server.register([require('vision'), require("inert")], function (err) {


	// DEMO
	/* ==================================================== */
	/* ==================================================== */

	/*
	|--------------------------------------------------------------------------
	|  Views
	|--------------------------------------------------------------------------
	|
	|  Configured views
	|
	*/
	server.views({
		engines: {
			html: {
				module: Handlerbars
			}
		},
		relativeTo: Path.join(__dirname, 'public'),
		path: './views',
		partialsPath: './views/partials'
	});


	/*
	|--------------------------------------------------------------------------
	|  Handle HTTP Status 404
	|--------------------------------------------------------------------------
	|
	|  404 Response Handler
	|
	*/
	server.ext('onPreResponse', function (request, reply)
	{
		if (request.response.isBoom)
		{
				//return reply.redirect('/');
		}

		return reply.continue();
	});


	/*
	|--------------------------------------------------------------------------
	|  Server Events
	|--------------------------------------------------------------------------
	|
	|  Catch-all server events
	|
	*/
	server.on('internalError', function (request, err)
	{
	});


	/*
	|--------------------------------------------------------------------------
	| WEB Route:
	|--------------------------------------------------------------------------
	|
	|  All routes pertaining to web pages
	|
	*/
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply)
		{
			reply.redirect("/alpha");
		}
	});

	server.route({
		method: 'GET',
		path: '/alpha',
		handler: function(request, reply)
		{
			reply.view('page', {id: "page"});
		}
	});

	server.route({
		method: 'GET',
		path: '/guidelines',
		handler: function(request, reply)
		{
			reply.view('page-guidelines', {id: "guidelines"});
		}
	});

	server.route({
		method: 'GET',
		path: '/alpha/access/instructions',
		handler: function(request, reply)
		{
			reply.view('page-alpha-access-instructions', {id: "alpha-access-instructions"});
		}
	});

	server.route({
		method: 'GET',
		path: '/onboard',
		handler: function(request, reply)
		{
			reply.view('page-onboard', {id: "onboard"});
		}
	});

	server.route({
		method: 'GET',
		path: '/type',
		handler: function(request, reply)
		{
			reply.view('page-type', {id: "type"});
		}
	});

	server.route({
		method: 'GET',
		path: '/test',
		handler: function(request, reply)
		{
			reply.view('page-test', {id: "test"});
		}
	});



	/*
	|--------------------------------------------------------------------------
	| API Endpoints
	|--------------------------------------------------------------------------
	|
	| All api endpoint routes
	|
	*/
	server.route({
		method: 'POST',
		path: '/api/v1/user/verify',
		handler: function(request, reply)
		{
				verifyToken(request, function(isTokenValid, dbUser) {
						if (isTokenValid) reply({valid: true, user: dbUser});
						else reply({valid: false, user: false});
				})
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/user/add',
		handler: function(request, reply)
		{
				var user = {
						name: request.payload.fullname || "",
						token: md5((new Date()).getTime()),
						added: (new Date())
				};

				db.collection("AlphaUser").insert(user, function(error, dbUser) {
						reply({user:dbUser, error:err});
				});

		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/user/update',
		handler: function(request, reply)
		{
			verifyToken(request, function(isTokenValid) {
					if (isTokenValid) {
							var user = {
								 	name: request.payload.name || "",
								 	photo: request.payload.photo || "",
								 	email: request.payload.email || "",
								 	token: request.payload.token || "",
								 	added: request.payload.added ? new Date(request.payload.added) : (new Date())
							};
							db.collection("AlphaUser").update({token: request.payload.token}, user, function(error, dbUser) {
									reply({user: dbUser, error: error});
							});
					}
					else reply({error: true, value: isTokenValid})

				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/articles',
		handler: function(request, reply)
		{
			verifyToken(request, function(isTokenValid) {
					db.collection("AlphaArticle").find({/*published: true*/}, function(error, dbArticles) {
							reply({articles: error ? [] : dbArticles});
					});
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/submit/article',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						if (isTokenValid) {
								var article = {
										user: request.payload.userid,
										article: request.payload.article,
										slug: request.payload.article.slug,
										created: (new Date()),
										updated: (new Date())
								};
							 	db.collection("AlphaArticle").insert(article, function(error, dbArticle) {
										if (!error && dbArticle) reply({article:dbArticle, error:error})
										else reply({error:error})
								})
						}
						else reply({error: true, value: isTokenValid})
				});
		}
	});

	server.route({
		method: 'GET',
		path: '/api/v1/media/{id}',
		handler: function(request, reply)
		{
				db.collection("AlphaMedia").findOne({_id: mongojs.ObjectId(cleanObjectId(request.params.id))}, function(error, dbMedia) {
						if (!error && dbMedia) {
								reply(dbMedia.media).type("text/plain");
						}
						else reply("").type("text/plain");
				})
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/media/add',
		config: {
        payload: {
            parse: true,
            maxBytes: 1024000000
        }
    },
		handler: function(request, reply)
		{
			 	db.collection("AlphaMedia").insert({ media: request.payload.media, created: (new Date()) }, function(error, dbMedia) {
						if (!error && dbMedia) reply({added:true, error:error, mediaid:dbMedia._id});
						else reply({added:false, error:error})
				})
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/review/article',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						if (isTokenValid) {
							var review = {
									user: request.payload.userid,
									article: request.payload.article,
									slug: request.payload.slug,
									review: request.payload.review,
									created: (new Date()),
									updated: (new Date())
							};
							 	db.collection("AlphaReviewedArticle").insert(review, function(error, dbArticle) {
										if (!error && dbArticle) reply({article:dbArticle, error:error})
										else reply({article:dbArticle, error:error})
								})
						}
						else reply({error: true, value: isTokenValid})
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/reviewed/articles',
		handler: function(request, reply)
		{
			verifyToken(request, function(isTokenValid) {
					db.collection("AlphaReviewedArticle").find({user: request.payload.userid}, function(error, dbArticles) {
							reply({articles: error ? [] : dbArticles});
					});
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/assigned/articles',
		handler: function(request, reply)
		{
			verifyToken(request, function(isTokenValid) {
					db.collection("AlphaArticle").find({published: {$ne: true}, user: {$ne: request.payload.userid}}, function(error, dbArticles) {
							reply({articles: error ? [] : dbArticles});
					});
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/api/v1/reviewed/articles',
		handler: function(request, reply)
		{
			verifyToken(request, function(isTokenValid) {
					db.collection("AlphaReviewedArticle").find({user: request.payload.userid}, function(error, dbArticles) {
							reply({articles: error ? [] : dbArticles});
					});
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/article/find',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						db.collection("AlphaArticle").findOne({slug: request.payload.slug}, function(error, dbArticle) {
								if (!error && dbArticle) reply({article: dbArticle})
								else reply({})
						})
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/draft/article/find',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						db.collection("AlphaDraftedArticle").findOne({slug: request.payload.slug}, function(error, dbArticle) {
								if (!error && dbArticle) reply({article: dbArticle})
								else reply({})
						})
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/read/article',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						db.collection("AlphaReadArticle").findOne({slug: request.payload.slug}, function(error, dbArticle) {
							var draft = {
									user: request.payload.userid,
									article: request.payload.article,
									slug: request.payload.slug,
									created: (new Date()),
									updated: (new Date())
							};
							if (dbArticle) {
										db.collection("AlphaReadArticle").update({slug: request.payload.slug }, draft, function(error, dbArticle) {
												reply({updated: !error});
										})
								}
								else {
										db.collection("AlphaReadArticle").insert(draft, function(error, dbArticle) {
												reply({error:error, article: dbArticle})
										})
								}
						})
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/draft/article',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						db.collection("AlphaDraftedArticle").findOne({slug: request.payload.slug}, function(error, dbArticle) {
							var draft = {
									user: request.payload.userid,
									article: request.payload.article,
									slug: request.payload.slug,
									created: (new Date()),
									updated: (new Date())
							};
							if (dbArticle) {
										db.collection("AlphaDraftedArticle").update({slug: request.payload.slug }, draft, function(error, dbArticle) {
												reply({updated: !error});
										})
								}
								else {
										db.collection("AlphaDraftedArticle").insert(draft, function(error, dbArticle) {
												reply({error:error, article: dbArticle})
										})
								}
						})
				});
		}
	});

		server.route({
				method: 'POST',
				path: '/api/v1/submitted/articles',
				handler: function(request, reply)
				{
					  verifyToken(request, function(isTokenValid) {
								db.collection("AlphaArticle").find({user: request.payload.userid}, function(error, dbArticles) {
										reply({articles: error ? [] : dbArticles});
								});
						});
				}
		});

	server.route({
		method: 'POST',
		path: '/api/v1/drafted/articles',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
						db.collection("AlphaDraftedArticle").find({user: request.payload.userid}, function(error, dbArticles) {
								reply({articles: error ? [] : dbArticles});
						});
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/read/articles',
		handler: function(request, reply)
		{
				verifyToken(request, function(isTokenValid) {
						db.collection("AlphaReadArticle").find({user: request.payload.userid}, function(error, dbArticles) {
								reply({articles: error ? [] : dbArticles});
						});
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/read/article/remove',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
							db.collection("AlphaReadArticle").remove({slug: request.payload.slug }, function(error, dbArticle) {
									reply({removed: !error})
							});
				});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/v1/draft/article/remove',
		handler: function(request, reply)
		{
			  verifyToken(request, function(isTokenValid) {
							db.collection("AlphaDraftedArticle").remove({slug: request.payload.slug }, function(error, dbArticle) {
									reply({removed: !error})
							});
				});
		}
	});

	/*
	|--------------------------------------------------------------------------
	| API Route: Static Files
	|--------------------------------------------------------------------------
	|
	| Static files
	|
	*/
	server.route({
		method: 'GET',
		path: '/{path*}',
		handler:
		{
			directory:
			{
				path: Path.join(__dirname, 'public'),
				listing: false,
				index: true
			}
		}
	});


	/*
	|--------------------------------------------------------------------------
	| API Route: Starts Server
	|--------------------------------------------------------------------------
	|
	|  Starts server
	|
	*/
	server.start(function()
	{
			console.log("### SERVER STARTED ###");
	});
});
