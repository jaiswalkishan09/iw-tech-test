import excelToJson from "convert-excel-to-json";
import fs from "fs";

type RawSheetDataType = {
  directory_category?: string;
  content_children_count?: string;
  directory_contact__email?: string;
  directory_contact__fax?: string;
  directory_contact__mobile?: string;
  directory_contact__phone?: string;
  directory_contact__website?: string;
  content_post_id?: string | number;
  content_post_slug?: string;
  content_body?: string;
  directory_location__street?: string;
  directory_location__city?: string;
  directory_location__country?: string;
  directory_location__address?: string;
  directory_location__lat?: string | number;
  directory_location__lng?: string | number;
  directory_location__zip?: string | number;
  directory_location__state?: string;
  directory_social__facebook?: string;
  directory_social__googleplus?: string;
  directory_social__twitter?: string;
  content_post_status?: string;
  content_post_title?: string;
};

const keyMapper = {
  directory_category: "categories",
  content_children_count: "contentCount",
  directory_contact__email: "email",
  directory_contact__fax: "fax",
  directory_contact__mobile: "mobile",
  directory_contact__phone: "phone",
  directory_contact__website: "website",
  content_post_id: "postId",
  content_post_slug: "postSlug",
  content_body: "body",
  directory_location__street: "street",
  directory_location__city: "city",
  directory_location__country: "country",
  directory_location__address: "address",
  directory_location__lat: "lat",
  directory_location__lng: "lng",
  directory_location__zip: "zip",
  directory_location__state: "state",
  directory_social__facebook: "facebook",
  directory_social__googleplus: "googlePlus",
  directory_social__twitter: "twitter",
  content_post_status: "postStatus",
  content_post_title: "postTitle",
};

async function getJsonValueFromXlsx(sheetName: string) {
  const result = excelToJson({
    sourceFile: `../input_xlsx/${sheetName}`,
    columnToKey: {
      "*": "{{columnHeader}}",
    },
  });
  return result;
}
async function logicToGetBestData(rawData: RawSheetDataType) {
  const data = {};
  const rawDataKeys = Object.keys(rawData);
  if (!rawData["directory_category"] || !rawData["content_post_status"]) {
    return {};
  }
  for (let i = 0; i < rawDataKeys.length; i++) {
    const key = rawDataKeys[i];
    if (key === "directory_category") {
      data[keyMapper[key]] = rawData[key].split(";");
    } else if (key === "content_children_count") {
      const splitedData = rawData[key].split(";");
      const childJson = {};
      for (let i = 0; i < splitedData.length; i++) {
        const splitKeyValue = splitedData[i].split("|");
        if (splitKeyValue.length === 2) {
          childJson[splitKeyValue[0]] = splitKeyValue[1];
        }
      }
      data[keyMapper[key]] = childJson;
    } else if (key === "directory_contact__email") {
      data[keyMapper[key]] = rawData[key].toLowerCase();
    } else if (
      key === "directory_contact__mobile" ||
      key === "directory_contact__phone"
    ) {
      const number = rawData[key].toString();
      data[keyMapper[key]] = number.replace(/[^0-9]/g, "");
    } else if (key === "content_post_status") {
      if (rawData[key].toLowerCase() != "published") return {};
      data[keyMapper[key]] = rawData[key].toLocaleUpperCase();
    } else {
      data[keyMapper[key]] = rawData[key];
    }
  }

  return data;
}

async function getBestData(sheetName: string) {
  const outputPath = `${__dirname}/../output_json/${sheetName.split(".")[0]}`;
  fs.mkdirSync(outputPath, { recursive: true });
  const jsonResult = await getJsonValueFromXlsx(sheetName);
  const sheetNames = Object.keys(jsonResult);
  for (let i = 0; i < sheetNames.length; i++) {
    const sheetName = sheetNames[i];
    const sheetData = jsonResult[sheetName];
    const path = `${outputPath}/${sheetName}.json`;
    const writeStream = fs.createWriteStream(path);
    console.log(`Data for sheet: ${sheetName}`);
    for (let i = 1; i < sheetData.length; i++) {
      const data = await logicToGetBestData(sheetData[i]);
      if (Object.keys(data).length > 0) {
        const stringifyData = JSON.stringify(data);
        writeStream.write(`${stringifyData}\n`);
        console.log(JSON.stringify(data), "\n");
      }
    }
    writeStream.end();
  }
}

fs.readdir(
  `${__dirname}/../input_xlsx`,
  { withFileTypes: true },
  (err, files) => {
    console.log("\nCurrent directory files:");
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        getBestData(file.name);
      });
    }
  }
);
