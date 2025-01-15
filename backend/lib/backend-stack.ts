import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function
    const stripeSubscriptionLambda = new Function(this, 'stripeSubscriptionLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(join(__dirname,"../lambdas")),
      handler: 'subscription.handler',
      memorySize: 512,
    }); 


    const stripeSubscriptionWebhookLambda = new Function(this, 'stripeSubscriptionWebhookLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(join(__dirname,"../lambdas")),
      handler: 'webhooksubscribe.handler',
      memorySize: 512,
    }); 

    const stripeInvoiceLambda = new Function(this, 'stripeInvoiceLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset(join(__dirname,"../lambdas")),
      handler: 'invoice.handler',
      memorySize: 512,
    }); 

    // Define the API Gateway REST API
    const api = new apigateway.RestApi(this, 'StripeSubscriptionAPI', {
      restApiName: 'Stripe Subscription Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS, // Allow all origins
        allowMethods: apigateway.Cors.ALL_METHODS, // Allow all HTTP methods
        allowHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
      },
    });

    // Create a resource and method for the Lambda function
    const subscriptionResource = api.root.addResource('subscription');
    subscriptionResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(stripeSubscriptionLambda, {
        proxy: true, // Proxy integration to pass through the request to Lambda
      }), 
      {
        // Additional method options (optional)
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );
   

    const subscriptionWebhookResource = api.root.addResource('subscriptionWebhook');
    subscriptionWebhookResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(stripeSubscriptionWebhookLambda, {
        proxy: true, // Proxy integration to pass through the request to Lambda
      }), 
      {
        // Additional method options (optional)
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );


    const subscriptionInvoiceResource = api.root.addResource('invoice');
    subscriptionInvoiceResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(stripeInvoiceLambda, {
        proxy: true, // Proxy integration to pass through the request to Lambda
      }), 
      {
        // Additional method options (optional)
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Origin': true,
            },
          },
        ],
      }
    );


  }
}
