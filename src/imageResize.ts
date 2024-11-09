import { S3Event } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { Jimp } from 'jimp';

const s3 = new AWS.S3();
const BUCKET = process.env.BUCKET || '';

export const handler = async (event: S3Event) => {
    const lastRecord = event.Records[event.Records.length - 1];
    const key = lastRecord.s3.object.key;

    if (key.includes('_resized')) {
        console.info(`File ${key} is already resized, skipping.`);
        return;
    }

    const params = {
        Bucket: BUCKET,
        Key: key,
    };

    try {
        const image = await s3.getObject(params).promise();

        const jimpImage = await Jimp.read(image.Body as Buffer);
        const resizedImage = await jimpImage.resize({ w: 256, h: 256 }).getBuffer('image/jpeg');

        await s3
            .putObject({
                Bucket: BUCKET,
                Key: key.replace('.jpg', '_resized.jpg'),
                Body: resizedImage,
            })
            .promise();

        console.info(`Image of key: ${key} is now resized and uploaded.`);
    } catch (error) {
        console.error(`Error processing image of key: ${key}`, error);
    }
};
