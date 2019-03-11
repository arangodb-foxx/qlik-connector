# qlik-connector

This is a simple qlik-connector allowing pagination of documents. Of course it is also able to
deliver the data to any other application. 

**IMPORTANT**

This is a demo application and will only work with enabled authentication (Basic Authentication).

**IMPORTANT**

## Routes

### /documents - Paginate documents inside a given collection (GET)

This route allows to get documents of a collection in a paginated way using url query
parameters.

Required query url parameter:
- `collection` (Collection to be used)

Optional query url parameters:
- `start` (Starting point of data to fetch)
- `count` (Amount of documents we want to fetch)

URL query parameter example:
```
  http://<address>:<port>/_db/<database>/<foxx-mount-path>/documents?collection=<your-collection>&start=0&count=5
```

### /executeQuery - Passthrough pagination parameters to a query (POST)

This route passes the `start` and `count` parameters defined via the url query parameters
into the bindParameter of a query using `@start` and `@count` as variables using e.g. the
AQL LIMIT function:  `... LIMIT @start, @count ... `.

Required json body attribute:
- `queryString` (Query to be executed)

Optional json body attribute:
- `queryBindVars` (Additional bind parameters to be used)

Optional query url parameters:
- `start` (Starting point of data to fetch)
- `count` (Amount of documents we want to fetch)

URL query parameter example:
```
  http://<address>:<port>/_db/<database>/<foxx-mount-path>/executeQuery?start=0&count=5
```

Raw JSON body example:

```
  {
    "queryString": "FOR u IN @@collection LIMIT @start, @count RETURN u",
    "queryBindVars": {
      "@collection": "users"
    }
  }
```

# Limitations

This application is an ArangoDB Foxx service. Foxx is based on Googles V8 JavaScript engine.
Due to that fact, it is also bound to Googles V8 Limitations. Keep in mind that all generated
data, needs to fit into your memory. To tweak some of the V8's parameters, ArangoDB offers a few
startup parameters to tweak V8 for your personal needs.

```
  --javascript.v8-contexts <uint64>           maximum number of V8 contexts that are created for executing JavaScript actions (default: 0)
  --javascript.v8-contexts-minimum <uint64>   minimum number of V8 contexts that keep available for executing JavaScript actions (default: 0)
  --javascript.v8-max-heap <uint64>           maximal heap size (in MB) (default: 3072)
```

# License

Copyright (c) 2019 ArangoDB GmbH, Cologne, Germany

License: Apache 2
