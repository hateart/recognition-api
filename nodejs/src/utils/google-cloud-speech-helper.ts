const speech = require('@google-cloud/speech');

export class GoogleCloudSpeechHeler {

    private _client;

    constructor() {
        this._client = new speech.SpeechClient();
    }

    public async recognize(content: string) {

        const audio = {
            content: content,
        };

        const config = {
            enableWordTimeOffsets: true,
            enableWordConfidence: true,
            encoding: 'MP3',
            sampleRateHertz: 22000,
            languageCode: 'en-US',
        };

        const request = {
            audio: audio,
            config: config,
        };

        return await this._client.recognize(request);

    }

    public async quickstart() {
        // The path to the remote LINEAR16 file
        const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
          uri: gcsUri,
        };
        const config = {
          enableWordTimeOffsets: true,
          enableWordConfidence: true,
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        };
        const request = {
          audio: audio,
          config: config,
        };

        return await this._client.recognize(request);

        /*
        // Detects speech in the audio file

        const [response] = await this._client.recognize(request);
        const transcription = response.results
          .map((result:any) => {
              console.log(result);

              result.alternatives[0].words.forEach((wordInfo:any) => {
                  // NOTE: If you have a time offset exceeding 2^32 seconds, use the
                  // wordInfo.{x}Time.seconds.high to calculate seconds.

                  console.log(wordInfo);
                  const startSecs =
                  `${wordInfo.startTime.seconds}` +
                  '.' +
                  wordInfo.startTime.nanos / 100000000;
                  const endSecs =
                  `${wordInfo.endTime.seconds}` +
                  '.' +
                  wordInfo.endTime.nanos / 100000000;
                  console.log(`Word: ${wordInfo.word}`);
                  console.log(`\t ${startSecs} secs - ${endSecs} secs`);
              });


              return result.alternatives[0].transcript
          })
          .join('\n');
        console.log(`Transcription: ${transcription}`);
        */
      }
}

