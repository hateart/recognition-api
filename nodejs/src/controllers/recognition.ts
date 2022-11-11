import * as fs from 'fs';
import * as http from 'http';


import { AwsS3Helper } from "../utils/aws-s3-helper";
import { RecognitionResponse } from "../business/recognition-response.model";
import { GoogleCloudSpeechHeler } from '../utils/google-cloud-speech-helper';
import { ErrorResponse } from '../business/error-response.model';


export default class RecognitionController {

    constructor(private _gHelper: GoogleCloudSpeechHeler, private _awsHelper: AwsS3Helper) { /* */ }

    public async getMessage(filename: string): Promise<RecognitionResponse|ErrorResponse> {

        const stringWithAudio = await this._getFileContent(filename);

        const result =  await this._gHelper.recognize(stringWithAudio.toString('base64'));

        let response = null;
        if (result[0]?.results)
            response = result[0].results as RecognitionResponse;
        else if (result.error)
            response = result as ErrorResponse;
        else
            response = {error : 'Unknow Error'} as ErrorResponse;

        return response;

    }

    private _getFileContent(filename: string) : Promise<Buffer> {

        return  new Promise<Buffer>((resolve, reject) => {

            this._awsHelper.getObjectAsBuffer('vi-st', filename)
            .then((data: Buffer) => {
                resolve(data);
            })
            .catch(err => reject(err))
            ;

        });
    }

}