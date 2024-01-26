# iw-tech-test

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Make sure you have Node.js installed on your machine.

## Running the Project

1.  Clone the repository to your local machine.
2.  Navigate to the project directory: `cd iw-tech-test`
3.  Install project dependencies: `npm install`
4.  Run the project: `npm start`

## Input and Output

1. **Input:**
   Place the Excel sheet that you wish to process into the `input_xlsx` folder located in the root directory of the project.

2. **Processing:**
   Our program will automatically retrieve all files from the `input_xlsx` folder and initiate the processing.

3. **Output:**
   a. All processed files will be stored in the `output_json` folder.
   b. Within the `output_json` folder, a subfolder will be created for each Excel file processed, named after the respective Excel file.
   c. Inside each subfolder, individual JSON files will be generated, named after the sheets within the Excel file. If there are multiple sheets, corresponding JSON files will be created for each sheet.

# Assumptions Made During Data Cleanup

1. We will only include those data whose status is "published"
2. We will not include data that lacks specified categories.
3. Key names have been modified to optimize the JSON object and provide more meaningful information.
