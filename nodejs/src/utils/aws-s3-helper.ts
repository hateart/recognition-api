import { Readable } from 'stream';
import { S3Client, GetObjectCommand, GetObjectCommandOutput } from '@aws-sdk/client-s3';

const REGION = "eu-central-1";

export class AwsS3Helper {

    private _s3client: S3Client;

    constructor() {
        this._s3client = new S3Client(
            {
                region: REGION,
                credentials : {
                    accessKeyId: process.env.S3_ACCESS_KEY as string,
                    secretAccessKey: process.env.S3_SECRET_KEY as string
                }
            }
        );


    }

    public async getObjectAsString(bucket: string, myFile: string) : Promise<string>
    {
        return new Promise<string>((resolve, reject) => {

            this.getObject(bucket, myFile)
            .then((output: GetObjectCommandOutput) => resolve(this._asString(output)))
            .catch(err => reject(err))

        });
    }

    public async getObjectAsBuffer(bucket: string, myFile: string) : Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) => {

            this.getObject(bucket, myFile)
            .then((output: GetObjectCommandOutput) => resolve(this._asBuffer(output)))
            .catch(err => reject(err))

        });
    }

    public getObject(bucket: string, myFile: string) : Promise<GetObjectCommandOutput> {

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: myFile
        });

        return this._s3client.send(command);
    }

    private _asStream(response: GetObjectCommandOutput) : Readable
    {
        return response.Body as Readable;
    }

    private _asBuffer(response: GetObjectCommandOutput) : Promise<Buffer>
    {
        const stream = this._asStream(response);
        const chunks: Buffer[] = [];
        return new Promise<Buffer>((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('error', (err) => reject(err));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    private _asString(response: GetObjectCommandOutput) : Promise<string>
    {
        return new Promise<string>((resolve, reject) => {
            this._asBuffer(response)
            .then((buffer: Buffer) => resolve(buffer.toString()))
            .catch(err => reject(err))
            ;
        });
    }

    /*
    public writeFileSync (path, buffer, permission) {
        permission = permission || 438; // 0666
        var fileDescriptor;

        try {
            fileDescriptor = fs.openSync(path, 'w', permission);
        } catch (e) {
            fs.chmodSync(path, permission);
            fileDescriptor = fs.openSync(path, 'w', permission);
        }

        if (fileDescriptor) {
            fs.writeSync(fileDescriptor, buffer, 0, buffer.length, 0);
            fs.closeSync(fileDescriptor);
        }
    }*/

}

// Set the AWS Region.
