const { BigQuery } = require('@google-cloud/bigquery');

const client = new BigQuery();

exports.loadJsonlData = async (source, dataset, table) => {
  const tableRef = client.dataset(dataset).table(table);
  return tableRef.createLoadJob(
    source,
    { sourceFormat: 'NEWLINE_DELIMITED_JSON' }
  );
};

exports.getTable = (dataset, table) => client.dataset(dataset).table(table);

exports.getTableContent = async (dataset, table) => {
  const [results] = await client.query(`SELECT
  *
FROM 
\`bigquery-stock-av.${dataset}.${table}\`;
`);
  return results;
}

const getParametersConfig = parameters => {
  if (parameters) return {
    parameterMode: 'NAMED',
    queryParameters: parameters
  };
  else return {}
}

exports.createQueryJob = (query, destination, params) => client.createQueryJob({
  createDisposition: 'CREATE_IF_NEEDED',
  writeDisposition: 'WRITE_APPEND',
  timePartitioning: {
    type: 'DAY',
    field: 'date'
  },
  priority: 'BATCH',
  destination,
  ...getParametersConfig(params),
  query
});

exports.createDateType = date => BigQuery.date(date);
