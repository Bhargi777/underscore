import numpy as np
import os
import json
import boto3
from backend.core.config import settings
from backend.core.logging import logger

class VectorService:
    def __init__(self):
        # Initialize boto3 client for Bedrock
        self.bedrock_client = boto3.client(
            service_name='bedrock-runtime', 
            region_name=settings.AWS_REGION
        )
        self.model_id = 'amazon.titan-embed-text-v1'

    def encode(self, text):
        """
        Generate embedding using Amazon Bedrock Titan Text Embeddings.
        """
        try:
            body = json.dumps({"inputText": text})
            response = self.bedrock_client.invoke_model(
                body=body,
                modelId=self.model_id,
                accept='application/json',
                contentType='application/json'
            )
            response_body = json.loads(response.get('body').read())
            return np.array(response_body['embedding'], dtype=np.float32)
        except Exception as e:
            logger.error(f"Error generating embedding from Bedrock: {e}")
            # Fallback to zero vector if Bedrock fails
            return np.zeros(1536, dtype=np.float32)  # Titan outputs 1536 dims

    def create_batch_index(self, concepts: list):
        """
        Create a temporary list of embeddings for concept objects.
        Returns the embeddings array and the concepts list.
        """
        if not concepts:
            return None, []
        
        texts = [f"{c['name']}: {c.get('description', '')}" for c in concepts]
        
        embeddings = []
        for text in texts:
            vec = self.encode(text)
            embeddings.append(vec)
            
        return np.array(embeddings), concepts

    def search_local_index(self, query_text, embeddings_array, candidates, k=10):
        """
        Perform a simple cosine similarity search using numpy.
        """
        if embeddings_array is None or len(candidates) == 0:
            return []
            
        query_vec = self.encode(query_text)
        
        # Calculate cosine similarity
        norm_query = np.linalg.norm(query_vec)
        norm_array = np.linalg.norm(embeddings_array, axis=1)
        
        # Avoid division by zero
        if norm_query == 0:
            return []
            
        sims = np.dot(embeddings_array, query_vec) / (norm_array * norm_query)
        
        # Get top k indices (argsort sorts ascending, so we take from the end and reverse)
        top_k_indices = np.argsort(sims)[-k:][::-1]
        
        results = []
        for idx in top_k_indices:
            results.append({
                "concept": candidates[idx],
                "score": float(1.0 - sims[idx]) # Return as distance (1 - similarity) to match FAISS API
            })
        return results

vector_service = VectorService()
