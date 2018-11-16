# Sequelize `statment_timeout` Demo

Test out how to set `statement_timeout` with [sequelize](http://docs.sequelizejs.com/).

Setting a statement timeout can make your application more [robust against runaway queries](https://www.citusdata.com/blog/2017/04/28/postgres-tips-for-rails/). This demo shows how to set a global statement timeout and also provide a longer timeout for a specific transaction using `SET LOCAL statement_timeout`.

## Setup

```
docker-compose build
docker-compose up
```

## Output

The code in [index.js](index.js) produces the following output:

```
test_1  | Fast query without transaction:
test_1  | Executing (default): SELECT 1
test_1  | [ [ { '?column?': 1 } ],
test_1  |   Result {
test_1  |     command: 'SELECT',
test_1  |     rowCount: 1,
test_1  |     oid: null,
test_1  |     rows: [ [Object] ],
test_1  |     fields: [ [Field] ],
test_1  |     _parsers: [ [Function] ],
test_1  |     RowCtor: null,
test_1  |     rowAsArray: false,
test_1  |     _getTypeParser: [Function: bound ] } ]
test_1  |
test_1  | Slow query without transaction:
test_1  | Executing (default): SELECT pg_sleep(2)
db_1    | 2018-11-16 17:54:38.917 UTC [131] ERROR:  canceling statement due to statement timeout
db_1    | 2018-11-16 17:54:38.917 UTC [131] STATEMENT:  SELECT pg_sleep(2)
test_1  | canceling statement due to statement timeout
test_1  |
test_1  | Slow query in transaction without local statement timeout:
test_1  | Executing (2d4a8cb9-d5a3-41db-b815-8fd294c57827): START TRANSACTION;
test_1  | Executing (2d4a8cb9-d5a3-41db-b815-8fd294c57827): SELECT pg_sleep(2)
test_1  | canceling statement due to statement timeout
test_1  | Executing (2d4a8cb9-d5a3-41db-b815-8fd294c57827): COMMIT;
db_1    | 2018-11-16 17:54:39.939 UTC [131] ERROR:  canceling statement due to statement timeout
db_1    | 2018-11-16 17:54:39.939 UTC [131] STATEMENT:  SELECT pg_sleep(2)
test_1  |
test_1  | Slow query in transaction with local statement timeout:
test_1  | Executing (fe7615b6-19cd-44ed-8e63-7694c499097a): START TRANSACTION;
test_1  | Executing (fe7615b6-19cd-44ed-8e63-7694c499097a): SET LOCAL statement_timeout = 3000
test_1  | Executing (fe7615b6-19cd-44ed-8e63-7694c499097a): SELECT pg_sleep(2)
test_1  | [ [ { pg_sleep: '' } ],
test_1  |   Result {
test_1  |     command: 'SELECT',
test_1  |     rowCount: 1,
test_1  |     oid: null,
test_1  |     rows: [ [Object] ],
test_1  |     fields: [ [Field] ],
test_1  |     _parsers: [ [Function: noParse] ],
test_1  |     RowCtor: null,
test_1  |     rowAsArray: false,
test_1  |     _getTypeParser: [Function: bound ] } ]
test_1  | Executing (fe7615b6-19cd-44ed-8e63-7694c499097a): COMMIT;
```


