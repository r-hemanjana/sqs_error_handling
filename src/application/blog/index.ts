import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const REGION = 'ap-south-1';
const dispatchQueueURL = process.env.QUEUE_URL;

export const pushIntoQueue = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('pushIntoQueue started!');

    try {
        const client = new SQSClient({ region: REGION });
        const input = {
            QueueUrl: dispatchQueueURL,
            MessageBody: JSON.stringify(event),
            DelaySeconds: 0,
            MessageAttributes: {
                Title: {
                    DataType: "String",
                    StringValue: "The Whistler",
                },
            },
        };

        const command = new SendMessageCommand(input);
        const response = await client.send(command);

        console.log(response.$metadata);

        return {
            statusCode: response.$metadata.httpStatusCode,
            messageId: response.MessageId
        }

    } catch (error) {
        return {
            statusCode: '500',
            message: JSON.stringify(error)
        }
    }
}
