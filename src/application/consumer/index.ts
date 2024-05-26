import { SQSEvent, SQSBatchResponse, SQSBatchItemFailure, SQSRecord } from 'aws-lambda';
import { SQSClient, ChangeMessageVisibilityCommand } from "@aws-sdk/client-sqs";

const REGION = 'ap-south-1';
const dispatchQueueURL = process.env.QUEUE_URL;

export const processMessage = async (event: SQSEvent): Promise<SQSBatchResponse> => {
    console.log("processMessage entered!!");

    const batchItemFailures: SQSBatchItemFailure[] = [];

    for (const record of event.Records) {
        try {
            await processMessageAsync(record);
        } catch (error) {
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }

    console.log(batchItemFailures);
    return {batchItemFailures: batchItemFailures};
};

async function processMessageAsync(record: SQSRecord): Promise<void> {

    const count = JSON.parse(record.body).count;

    if (record.body && count == 2) {
        // API call is failing
        throw new Error("There is an error in the SQS Message.");
    }else{
        // API call is successful
        console.log(`Processed message ${record.body}`);
    }
}

// async function ChangeMessageVisibilityTimeout(receiptHandle: string) {
//     const client = new SQSClient({ region: REGION });
//     const input = { 
//         QueueUrl: dispatchQueueURL,
//         ReceiptHandle: receiptHandle,
//         VisibilityTimeout: 600,
//     };
//     console.log(input);
//     const command = new ChangeMessageVisibilityCommand(input);
//     const response = await client.send(command);

//     console.log(`Message visibility timeout changed, statusCode ${JSON.stringify(response.$metadata)}`);
// }