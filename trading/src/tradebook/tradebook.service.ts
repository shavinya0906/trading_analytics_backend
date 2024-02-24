import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Model } from 'dynamoose/dist/Model';
import * as XLSX from 'xlsx';
import * as dynamoose from 'dynamoose';

@Injectable()
export class TradeService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_AUTH_BACKEND_ACCESS_KEY,
      secretAccessKey: process.env.AWS_AUTH_BACKEND_SECRET_KEY,
      region: process.env.AWS_AUTH_BACKEND_REGION
    });
  }

  // Your existing code ...

  async uploadTradeFile(user:any, file: Express.Multer.File): Promise<any> {
    try {
      // Generate a unique key for the S3 object (adjust this as needed)
      const s3Key = `uploads/tradebook-files/${user.id}`;

      // Upload the file to S3
      const s3Params = {
        Bucket: 'tradebook-files',
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const s3UploadResponse = await this.s3.upload(s3Params).promise();

      // Return the S3 URL along with the inserted trades
      return {
        fileUrl: s3UploadResponse.Location,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //making service to extract the url of existing file from s3 bucket uploads folder
  async getExistingFileURL(user:any) {
    try {
      // Generate a unique key for the S3 object incorporating the user's identifier
      const s3Key = `uploads/tradebook-files/${user.id}`;
  
      const s3ListObjectsResponse = await this.s3.listObjectsV2({
        Bucket: 'tradebook-files',
        Prefix: s3Key,
      }).promise();
  
      if (s3ListObjectsResponse.Contents && s3ListObjectsResponse.Contents.length > 0) {
        // Assuming there is only one file for each user
        const s3Params = {
          Bucket: 'tradebook-files',
          Key: s3ListObjectsResponse.Contents[0].Key,
        };
  
        // Retrieve the file content from S3
        const s3GetObjectResponse = await this.s3.getObject(s3Params).promise();
  
        // Parse Excel file content
        const workbook = XLSX.read(s3GetObjectResponse.Body);
  
        // Assuming there is only one sheet, get the sheet data
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const keys = Object.keys(sheetData[0]);
        const resultArray = [keys];
  
        // Populate the result array with values
        sheetData.forEach((entry) => {
          const values = keys.map((key) => entry[key]);
          resultArray.push(values);
        });
  
        return resultArray;
      } else {
        // Handle the case where no file is found for the user
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
