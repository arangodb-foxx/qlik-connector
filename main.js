'use strict';

// modules
const aql = require('@arangodb').aql;
const db = require('@arangodb').db;
const joi = require('joi');

const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

module.context.use(router);

router.get('/documents', function (req, res) {
  // will only work with authentication
  // use basic auth
  if (!req.arangoUser) {
    res.throw('unauthorized');
  }

  // query params available here: req.queryParams);
  let result = {};

  const start = req.queryParams.start;
  const count = req.queryParams.count;

  if (Number.isInteger(start) && Number.isInteger(count)) {
    // returns a subset of all documents using limit
    try {
      result = db._query(`
        FOR x IN ${req.queryParams.collection} LIMIT ${start}, ${count} RETURN x
      `, null, null, {fullCount: true});
    } catch (e) {
      res.throw('bad request', e.message, {cause: e});
    }
  } else {
    // returns all documents
    try {
      result = db._query(`
        FOR x IN ${req.queryParams.collection} RETURN x
      `, null, null, {fullCount: true});
    } catch (e) {
      res.throw('bad request', e.message, {cause: e});
    }
  }
  res.send(JSON.stringify(result));
})
.queryParam('collection', joi.string().required())
.queryParam('start', joi.number().optional())
.queryParam('count', joi.number().optional())
.response(['text/json'], 'Object of documents and statistics.')
.summary('Pagination of documents of a given collection')
.description('This route is delivering paginated documents of a collection. If start and count are not defined, all documents will be returned.');

router.post('/executeQuery', function (req, res) {
  // will only work with authentication
  // use basic auth
  if (!req.arangoUser) {
    res.throw('unauthorized');
  }
  // query params available here: req.queryParams);

  // set the query string (must be defined)
  const queryString = req.body.queryString;

  // set the query bind parameters (optional)
  const queryBindVars = req.body.queryBindVars || {};

  const start = req.queryParams.start;
  const count = req.queryParams.count;
  // overwrite start and count bind parameters if defined via query parameter
  if (Number.isInteger(start)) {
    queryBindVars.start = start;
  }
  if (Number.isInteger(count)) {
    queryBindVars.count = count;
  }

  let result;
  try {
    result = db._query(queryString, queryBindVars, null, {fullCount: true});
  } catch (e) {
    res.throw('bad request', e.message, {cause: e});
  }

  res.send(JSON.stringify(result));
})
.body(joi.object({
  queryString: joi.string().required(),
  queryBindVars: joi.object().optional()
}).required(), 'Query string needs to be defined.')
.queryParam('start', joi.number().optional())
.queryParam('count', joi.number().optional())
.response(['text/json'], 'Object of query results and statistics.')
.summary('Pagination of query results')
.description(`
  This route is delivering paginated documents of a collection.
  If start and count are not defined, all documents will be returned.
  You need to use @start and @count as bind parameters in your query if you want to passthrough your values as query parameters.
`);
