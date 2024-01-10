import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as XLSX from 'xlsx';

@Injectable()
export class TradeService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3();
  }

  // Your existing code ...

  async uploadTradeFile(user, file: Express.Multer.File): Promise<any> {
    try {
      // Generate a unique key for the S3 object (adjust this as needed)
      const s3Key = `uploads/tradebook-file`;

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
  async getExistingFileURL() {
    // try {
    //   const s3Params = {
    //     Bucket: 'tradebook-files',
    //     Key: 'uploads/tradebook-file'
    //   };

    //   const s3UploadResponse = await this.s3.getSignedUrlPromise(
    //     'getObject',
    //     s3Params,
    //   );

    //   // Parse the URL to remove query parameters
    //   const urlObject = new URL(s3UploadResponse);
    //   urlObject.search = ''; // Remove query parameters

    //   return {
    //     fileUrl: urlObject.toString(),
    //   };
    // } catch (error) {
    //   throw new InternalServerErrorException(error);
    // }
    try {
      const s3Params = {
        Bucket: 'tradebook-files',
        Key: 'uploads/tradebook-file',
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
