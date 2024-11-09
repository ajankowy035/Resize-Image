import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();
const BUCKET = process.env.BUCKET || '';

export const handler = async (event: APIGatewayProxyEvent) => {
    const key = event.pathParameters?.id;

    if (!key) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Key is required' }),
        };
    }

    const params = {
        Bucket: BUCKET,
        Key: key,
    };

    try {
        const url = await s3.getSignedUrlPromise('getObject', params);

        return {
            statusCode: 200,
            body: JSON.stringify({ url }),
        };
    } catch (error) {
        console.error(`Error generating signed URL for key: ${key}`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Could not generate signed URL' }),
        };
    }
};
