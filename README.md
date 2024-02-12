# Qlik REST connector for ArangoDB

This is an example Qlik connector for ArangoDB.

## Installation

The Qlik connector can be installed as a Foxx service using the
[ArangoDB web interface](https://docs.arangodb.com/stable/components/web-interface/services/)
or the [Foxx CLI](https://github.com/arangodb/foxx-cli):

```sh
$ npm install --global foxx-cli
$ foxx install -u root -P -H http://localhost:8529 -D _system /qlik \
https://github.com/arangodb-foxx/qlik-connector/archive/master.zip

# or without installing foxx-cli:

$ npx foxx-cli install -u root -P -H http://localhost:8529 -D _system /qlik \
https://github.com/arangodb-foxx/qlik-connector/archive/master.zip
```

## Configuration

Before you can use the ArangoDB connector in Qlik you need to configure the
service using the web interface or the Foxx CLI.

To configure the service in the ArangoDB web interface, open the service details
and then navigate to the _Settings_ tab in the top bar.

- **collections**: list of names of collections that will be exposed to Qlik,
  as a comma-separated list, e.g. `payments,timeouts` will expose the collections
  `payments` and `timeouts` in the database the service was installed.

- **username** and **password**: credentials that will be used by Qlik to
  authenticate against this service.

  **Note**: These credentials will only be used by Qlik and should **not**
  match the ArangoDB user credentials used to access ArangoDB itself.

## Adding the data source

To add the connector as a data source in Qlik, open the _Add Data_ dialog and
select the _REST_ connector.

Set **URL** to the URL of the service followed by the name of the collection
you wish to import, e.g. `http://localhost:8529/_db/_system/qlik/timeouts`.

Set **Authentication Schema** to `Basic` and use the credentials from the
service configuration.

Set **Pagination** to `Offset` with the following options:

- **'Start' parameter name**: `start`
- **'Start' initial value**: `0`
- **'Count' parameter name**: `count`
- **'Count' initial value**: `200`
- **'Total records' path**: `meta/totalCount`
- **Data indicator path**: `data`

## License

This code is licensed under the
[Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
