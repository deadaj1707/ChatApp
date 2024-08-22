import { Client } from '@elastic/elasticsearch';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config();
const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'https://localhost:9200',
    auth: {
        username: 'Adi',
        password: '1234'
      },
    maxRetries: 5, // Increase retries
    requestTimeout: 60000 // Increase timeout (in milliseconds)
  });

export async function indexDocument(text, fileId) {
  try {
    // Split text into chunks
    const chunks = text.split('\n\n'); // Simple split by double new lines

    for (let i = 0; i < chunks.length; i++) {
      await esClient.index({
        index: 'pdf-documents',
        id: `${fileId}-${i}`,
        body: {
          fileId: fileId,
          chunk: chunks[i],
        },
      });
    }
    await esClient.indices.refresh({ index: 'pdf-documents' });
    console.log('Document indexed successfully.');
  } catch (error) {
    console.error('Error indexing document:', error);
  }
}

export async function retrieveRelevantChunks(query) {
  try {
    const { body } = await esClient.search({
      index: 'pdf-documents',
      body: {
        query: {
          match: {
            chunk: query,
          },
        },
      },
    });
    return body.hits.hits.map(hit => hit._source.chunk).join('\n\n');
  } catch (error) {
    console.error('Error retrieving relevant chunks:', error);
    return '';
  }
}
