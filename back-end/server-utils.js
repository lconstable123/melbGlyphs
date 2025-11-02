import { dynamo } from "./utils/dynamo.js"; // adjust the path if needed
import {
  PutItemCommand,
  ScanCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { StoredImages, Artists } from "./fake-data.js";
const IMAGES_TABLE = process.env.IMAGES_TABLE || "Images";
const ARTISTS_TABLE = process.env.ARTISTS_TABLE || "Artists";

export const findImageById = (images, id) => {
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Image not found" });
  }
  const FoundImage = images[index];
  console.log(FoundImage);
  return { FoundImage, index };
};

//-----------------------------------------------------------------ADD TO SERVER FUNCTION------------------------------------------------------------

export const addToServer = async (data) => {
  const isServer = process.env.IS_SERVER;
  if (!isServer) {
    console.log("Adding images to local storage");
    if (StoredImages) {
      StoredImages.push(...data);
    } else {
      console.log("No storedImages array provided");
    }

    const newArtists = data.map((img) => img.artist).filter(Boolean);

    //server update -update

    newArtists.forEach((newArtist) => {
      if (!Artists.includes(newArtist)) {
        console.log("Adding new artist:", newArtist);
        Artists.push(newArtist);
        console.log("Current artists list:", Artists);
      }
    });
    return;
  }
  console.log("Adding images to db storage");
  for (const img of data) {
    // Store image in DynamoDB

    const item = {
      PK: { S: `IMAGE#${img.id}` },
      SK: { S: "META" },
      artist: { S: img.artist || "" },
      suburb: { S: img.suburb || "" },
      path: { S: img.path || "" },
      uploadedAt: { S: img.uploadedAt || new Date().toISOString() },
      isOnServer: { BOOL: !!img.isOnServer },
      locationData: {
        M: {
          latitude: { N: img.locationData.latitude.toString() },
          longitude: { N: img.locationData.longitude.toString() },
        },
      },
      capped: { S: img.capped || "" },
    };

    console.log("Storing image in DynamoDB:", item);

    await dynamo.send(
      new PutItemCommand({
        TableName: IMAGES_TABLE,
        Item: item,
      })
    );
    console.log("Image added to DynamoDB:", img.id);
    // Store artist if not exists
    if (img.artist) {
      console.log("Checking artist in DynamoDB:", img.artist);
      try {
        await dynamo.send(
          new PutItemCommand({
            TableName: ARTISTS_TABLE,
            Item: {
              PK: { S: `ARTIST#${img.artist}` },
              SK: { S: `META` },
              createdAt: { S: new Date().toISOString() },
            },
            ConditionExpression: "attribute_not_exists(PK)", // only add if not exists
          })
        );
        console.log("Artist added to DynamoDB:", img.artist);
      } catch (err) {
        // Artist already exists, ignore
      }
    }
  }
};

//-----------------------------------------------------------------DELETE IMAGE FROM SERVER FUNCTION------------------------------------------------------------

export const deleteImageFromServer = async (id) => {
  const isServer = process.env.IS_SERVER;

  if (!isServer) {
    console.log("Adding images to local storage");
    const { FoundImage, index } = findImageById(StoredImages, id);
    if (FoundImage) {
      console.log("Found image to delete:", FoundImage.path);
      StoredImages.splice(index, 1);

      if (FoundImage.artist) {
        console.log("Deleted image artist:", FoundImage.artist);
        const artistStillExists = StoredImages.some(
          (img) => img.artist === FoundImage.artist
        );
        if (artistStillExists) {
          console.log("Artist still has images:", FoundImage.artist);
        } else {
          console.log("Artist has no more images:", FoundImage.artist);

          const index = Artists.indexOf(FoundImage.artist);
          if (index !== -1) {
            Artists.splice(index, 1); // removes the artist
          }
          console.log("Updated artists list:", Artists);
        }
      }
      return FoundImage.path;
    } else {
      console.log("Image not found in local storage:", id);
      return null;
    }
  }

  console.log("Deleting images from db storage");

  // Construct PK/SK for the item
  const PK = `IMAGE#${id}`;
  const SK = "META";

  try {
    // Delete the image
    const { Attributes } = await dynamo.send(
      new DeleteItemCommand({
        TableName: IMAGES_TABLE,
        Key: { PK: { S: PK }, SK: { S: SK } },
        ReturnValues: "ALL_OLD", // returns the deleted item
      })
    );
    if (!Attributes) {
      console.log("Image not found in DynamoDB:", id);
      return {
        success: false,
        message: "Image not found",
      };
    }
    console.log(`Image ${id} deleted from DynamoDB`);

    const artist = Attributes.artist?.S;

    if (artist) {
      const queryResult = await dynamo.send(
        new QueryCommand({
          TableName: ARTISTS_TABLE,
          IndexName: "artist-index", // You need a GSI on artist for this
          KeyConditionExpression: "artist = :a",
          ExpressionAttributeValues: {
            ":a": { S: artist },
          },
          Limit: 1, // Only need to know if any exist
        })
      );

      if (!queryResult.Items || queryResult.Items.length === 0) {
        // Delete artist if no other images exist
        await dynamo.send(
          new DeleteItemCommand({
            TableName: ARTISTS_TABLE,
            Key: { PK: { S: `ARTIST#${artist}` }, SK: { S: `META` } },
          })
        );
        console.log(`Deleted artist ${artist} from ARTISTS_TABLE`);
      }
    }
    console.log("returning path:", Attributes?.path?.S);
    return Attributes?.path?.S;
  } catch (err) {
    console.error("Error deleting image from DynamoDB:", err);
    return null;
  }
};

//-----------------------------------------------------------------FETCH IMAGES AND ARTISTS FUNCTIONS------------------------------------------------------------

export const fetchImages = async () => {
  console.log("fetching images");
  // console.log("DynamoDB config:", dynamo.config);
  const isServer = process.env.IS_SERVER;
  if (!isServer) {
    console.log("Fetching images from local storage");
    return StoredImages;
  }
  console.log("Fetching images from db storage");
  try {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: IMAGES_TABLE,
      })
    );
    const images = result.Items.map((item) => ({
      id: item.PK.S.replace("IMAGE#", ""),
      artist: item.artist?.S || null,
      suburb: item.suburb?.S || null,
      locationData: {
        latitude: parseFloat(item.locationData.M?.latitude?.N || 0),
        longitude: parseFloat(item.locationData.M?.longitude?.N || 0),
      },
      uploadedAt: item.uploadedAt?.S,
      capped: item.capped?.S || null,
      path: item.path.S,
      isOnServer: item.isOnServer.BOOL,
    }));
    console.log("Fetched images:", images.length);
    return images;
  } catch (err) {
    console.error("Error fetching images from DynamoDB:", err);
    return [];
  }
};

export const fetchArtists = async () => {
  const isServer = process.env.IS_SERVER;
  if (!isServer) {
    console.log("Fetching artists from local storage");
    return Artists;
  }
  console.log("Fetching artists from db storage");
  try {
    const result = await dynamo.send(
      new ScanCommand({
        TableName: ARTISTS_TABLE,
      })
    );
    const artists = result.Items.map((item) =>
      item.PK.S.replace("ARTIST#", "")
    );
    return artists;
  } catch (err) {
    console.error("Error fetching artists from DynamoDB:", err);
    return [];
  }
};

//-----------------------------------------------------------------UPDATE IMAGE ON SERVER FUNCTION------------------------------------------------------------

export const updateImageOnServer = async (id, updatedData) => {
  const isServer = process.env.IS_SERVER;
  if (!isServer) {
    console.log("updateImage called with ID:", id);
    const { FoundImage, index } = findImageById(StoredImages, id);
    const parsed = imageObjectSchema.safeParse(FoundImage);
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.errors);
      return {
        success: false,
        message: "Validation errors",
      };
    }
    StoredImages[index] = { ...FoundImage, ...updatedData };
    console.log("Updated image:", StoredImages[index]);

    return {
      success: true,
      message: `Image with ID ${id} updated successfully`,
    };
  }
  console.log("Updating image in db storage");
  const PK = `IMAGE#${id}`;
  const SK = "META";

  try {
    let updateExp = [];
    let expAttrValues = {};
    for (const key in updatedData) {
      const value = updatedData[key];
      if (value !== undefined && value !== null) {
        const attrName = `#${key}`;
        const attrValue = `:${key}`;
        updateExp.push(`${attrName} = ${attrValue}`);

        if (typeof value === "string") expAttrValues[attrValue] = { S: value };
        if (typeof value === "boolean")
          expAttrValues[attrValue] = { BOOL: value };
        if (typeof value === "number")
          expAttrValues[attrValue] = { N: value.toString() };
        else if (typeof value === "object") {
          // example for locationData
          if (key === "locationData") {
            expAttrValues[attrValue] = {
              M: {
                latitude: { N: value.latitude.toString() },
                longitude: { N: value.longitude.toString() },
              },
            };
          }
        }
      }
    }
    if (updateExp.length === 0) {
      return { success: false, message: "No valid fields to update" };
    }
    const command = new UpdateItemCommand({
      TableName: IMAGES_TABLE,
      Key: { PK: { S: PK }, SK: { S: SK } },
      UpdateExpression: `SET ${updateExp.join(", ")}`,
      ExpressionAttributeNames: Object.fromEntries(
        Object.keys(updatedData).map((k) => [`#${k}`, k])
      ),
      ExpressionAttributeValues: expAttrValues,
      ReturnValues: "ALL_NEW", // returns the updated item
    });

    const result = await dynamo.send(command);
    return {
      success: true,
      message: `Image with ID ${id} updated successfully`,
      // updatedItem: result.Attributes,
    };
  } catch (err) {
    console.error("Error updating image in DynamoDB:", err);
    return { success: false, message: "Error updating image" };
  }
};
