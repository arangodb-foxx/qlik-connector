'use strict';

// modules
const aql = require('@arangodb').aql;
const db = require('@arangodb').db;
const joi = require('joi');

const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

module.context.use(router);

router.get('/documents', function (req, res) {
  // query params available here: req.queryParams);

  const result = db._query(`
    FOR x IN ${req.queryParams.collection} LIMIT ${req.queryParams.start}, ${req.queryParams.count} RETURN x
  `, null, null, {fullCount: true});

  res.send(JSON.stringify(result));
})
.queryParam('collection', joi.string().required())
.queryParam('start', joi.number().required())
.queryParam('count', joi.number().required())
.response(['text/json'], 'List of documents.')
.summary('Pagination of documents of a given collection')
.description('This route is delivering paginated documents of a collection.');
