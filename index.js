"use strict";
const joi = require("joi");
const { aql, db } = require("@arangodb");
const { context } = require("@arangodb/locals");
const createRouter = require("@arangodb/foxx/router");
const { getAuth } = require("./util");

/** @type {{ collections: string; username: string; password: string; }} */
const cfg = context.configuration;

const COLLECTIONS = cfg.collections.split(",").map(str => str.trim());
for (const collectionName of COLLECTIONS) {
  if (!db._collection(collectionName)) {
    throw new Error(
      `Invalid service configuration. Unknown collection: ${collectionName}`
    );
  }
}

const router = createRouter();
context.use(router);

router.use((req, res, next) => {
  const auth = getAuth(req);
  if (!auth || !auth.basic) {
    res.throw(401, "Authentication required");
  }
  const { username, password } = auth.basic;
  if (
    username !== cfg.username ||
    (cfg.password && password !== cfg.password)
  ) {
    res.throw(403, "Bad username or password");
  }
  next();
});

router
  .get("/", (_req, res) => {
    res.json(COLLECTIONS);
  })
  .response(joi.array().items(joi.string()), "List of collection names.")
  .summary("List the available collections")
  .description(
    "This endpoint returns the names of collections that can be queried."
  );

router
  .get("/:collection", (req, res) => {
    /** @type {{ collection: string; }} */
    const { collection: collectionName } = req.pathParams;
    const collection = db._collection(collectionName);
    /** @type {{ start: number; count: number; }} */
    const { start, count } = req.queryParams;

    const { query, bindVars } = aql`
      FOR doc IN ${collection}
      LIMIT ${start}, ${count}
      RETURN doc
    `;
    const result = db._query(query, bindVars, { fullCount: true });
    const { fullCount } = result.getExtra().stats;
    res.json({
      // NOTE: Qlik needs the total count to be wrapped in a JSON object.
      // Exposing it on the root causes an error during data load.
      meta: {
        totalCount: fullCount
      },
      data: result.toArray()
    });
  })
  .pathParam(
    "collection",
    joi.only(...COLLECTIONS).required(),
    "Name of the collection to read data from."
  )
  .queryParam(
    "start",
    joi
      .number()
      .integer()
      .default(0)
      .optional(),
    "Starting offset of the result set."
  )
  .queryParam(
    "count",
    joi
      .number()
      .integer()
      .default(100)
      .optional(),
    "Number of documents to return, defaults to 100."
  )
  .response(
    joi.object().keys({
      start: joi.number().integer(),
      count: joi.number().integer(),
      total_count: joi.number().integer(),
      records: joi.array().items(joi.object())
    }),
    "Query results slice."
  )
  .summary("Pagination of documents of a given collection")
  .description("This route is delivering paginated documents of a collection.");
