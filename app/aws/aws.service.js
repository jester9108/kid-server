// app/aws/aws.service.js

'use strict';

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

class AwsService {
    constructor() {
        AWS.config.update({ region: 'us-west-2' });
        AWS.config.apiVersions = {
            s3: '2006-03-01',
        };

        this._s3 = new AWS.S3();
    }

    async listBuckets() {
        try {
            return new Promise((resolve, reject) => {
                this._s3.listBuckets((err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }

    async uploadToBucket(bucketName, store, dir, file, id) {
        try {
            // Generate file stream
            const fileStream = fs.createReadStream(file.path);
            fileStream.on('error', (err) => {
                throw new Error(err);
            });

            // Prepare upload params
            const fileExt = file.originalname.slice(file.originalname.lastIndexOf('.'));
            const uploadParams = {
                Bucket: bucketName, // Name of s3 bucket
                Key: `${store.id}-${store.store.name}/${dir}/${`${id}${fileExt}` || `${Date.now()}-${file.originalname}`}`, // Name of file
                Body: fileStream, // File stream
            };

            // Call S3 to retrieve upload file to specified bucket
            return new Promise((resolve, reject) => {
                this._s3.upload(uploadParams, async (err, data) => {
                    await this._removeTempFile(file.path);
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Upload Success', data.Location);
                        resolve(data);
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }

    async _removeTempFile(filePath) {
        try {
            return new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AwsService();
