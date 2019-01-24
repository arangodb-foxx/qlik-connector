# qlik-connector

This is a simple qlik-connector allowing pagination of documents

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
