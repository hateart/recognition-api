import express from "express";


import PingController from "../controllers/ping";
import RecognitionController from "../controllers/recognition";
import { AwsS3Helper } from "../utils/aws-s3-helper";
import { GoogleCloudSpeechHeler } from "../utils/google-cloud-speech-helper";

const router = express.Router();
const awsS3Helper = new AwsS3Helper();
const gHelper = new GoogleCloudSpeechHeler();

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.get("/recognition", async (_req, res) => {

    const controller = new RecognitionController(gHelper, awsS3Helper);

    const filename = _req.query.filename as string;

    try {
        const response = await controller.getMessage(filename);
        return res.send(response);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: (error as Error).message });
    }

});

router.get("*", async (_req, res) => {
    return res.status(404).json({ error: 'check route' });
});

export default router;