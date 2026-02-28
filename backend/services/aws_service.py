import boto3
import json
from botocore.exceptions import ClientError
from backend.core.config import settings
from backend.core.logging import logger

class AWSService:
    def __init__(self):
        self.region = settings.AWS_REGION
        self.s3_bucket = settings.AWS_S3_BUCKET
        self.dynamodb_table = settings.AWS_DYNAMODB_TABLE
        
        # Initialize boto3 clients
        self.s3 = boto3.client('s3', region_name=self.region)
        self.dynamodb = boto3.resource('dynamodb', region_name=self.region)
        self.bedrock = boto3.client('bedrock-runtime', region_name=self.region)

    def upload_to_s3(self, file_path: str, object_name: str) -> bool:
        """Upload a file to an S3 bucket"""
        try:
            self.s3.upload_file(file_path, self.s3_bucket, object_name)
            logger.info(f"Successfully uploaded {object_name} to S3 bucket {self.s3_bucket}")
            return True
        except ClientError as e:
            logger.error(f"S3 Upload failed: {e}")
            return False

    def download_from_s3(self, object_name: str, file_path: str) -> bool:
        """Download a file from an S3 bucket"""
        try:
            self.s3.download_file(self.s3_bucket, object_name, file_path)
            logger.info(f"Successfully downloaded {object_name} from S3 bucket {self.s3_bucket}")
            return True
        except ClientError as e:
            logger.error(f"S3 Download failed: {e}")
            return False

    def write_to_dynamodb(self, item: dict):
        """Write an item to DynamoDB"""
        try:
            table = self.dynamodb.Table(self.dynamodb_table)
            table.put_item(Item=item)
            logger.info(f"Successfully wrote item to DynamoDB table {self.dynamodb_table}")
            return True
        except ClientError as e:
            logger.error(f"DynamoDB Write failed: {e}")
            return False

    def invoke_bedrock_llm(self, messages: list, model_id: str = "anthropic.claude-3-haiku-20240307-v1:0", temperature: float = 0.1):
        """Invoke Amazon Bedrock LLM with messages payload"""
        try:
            # Bedrock Converse API mapping for messages
            formatted_messages = []
            for msg in messages:
                if msg["role"] == "system":
                    # For Claude via Bedrock, system prompt goes in a separate parameter usually or we map it to user
                    formatted_messages.append({
                        "role": "user",
                        "content": [{"text": f"System Instruction: {msg['content']}"}]
                    })
                else:
                    formatted_messages.append({
                        "role": msg["role"], 
                        "content": [{"text": msg["content"]}]
                    })

            response = self.bedrock.converse(
                modelId=model_id,
                messages=formatted_messages,
                inferenceConfig={
                    "temperature": temperature
                }
            )
            return response['output']['message']['content'][0]['text']
        except ClientError as e:
            logger.error(f"Bedrock invocation failed: {e}")
            raise e

aws_service = AWSService()
