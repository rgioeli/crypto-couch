import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "../../../src/lib/cloudinary";
import { getSession } from "next-auth/react";
import { mongoConnect } from "../../../src/lib/mongodbConnect";
import multiparty from "multiparty";
import Joi from "@hapi/joi";
import { v4 } from "uuid";

export default async function handler(req, res) {
  const session = await getSession({ req });
  console.log(session);

  //this ensures someone is using the post method to get this request
  if (req.method !== "POST" || !session)
    return res
      .status(401)
      .json({ error: "This action is only allowed by authorized users." });

  //this ensures we don't send a blank form - a blank form doesn't send a content-type header
  if (!req.headers["content-type"])
    return res.status(400).json({ error: "The form can't be blank." });

  //get the data within the form
  const formData = await createFormData(req);

  //If there's something with the parsing of the form data - return a server error
  if (formData?.err)
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try your request again." });

  const { fields, files } = formData;

  //username and handle are both required - if we don't get one, return an error
  if (!fields?.username || !fields?.handle)
    return res
      .status(400)
      .json({ error: "Username and handle are both required." });

  //we are going to need the user info for the next few steps
  const user = await getUserFromMongodb(session);
  if (user?.error) return res.status(400).json(user);

  // lets make sure the file has the right extension
  let secure_url = null;

  if (files?.file) {
    const fileCheckResponse = validateFile(files.file[0]);
    if (fileCheckResponse?.error)
      return res.status(400).json(fileCheckResponse);

    const uploadImageResponse = await addFileToCloudinary(files.file[0], user);

    if (uploadImageResponse?.error)
      return res.status(400).json(uploadImageResponse);

    secure_url = uploadImageResponse.secure_url;
  } else {
    secure_url = "/images/couch.png";
  }

  const checkUsername = validateUsername(fields?.username[0]);
  if (checkUsername?.error) return res.status(400).json(checkUsername);

  const checkHandle = validateHandle(fields?.handle[0]);
  if (checkHandle?.error) return res.status(400).json(checkHandle);

  const checkBio = validateBio(fields?.bio[0]);
  if (checkBio?.error) return res.status(400).json(checkBio);

  const updateUserInDatabaseResponse = await updateUserInDatabase(
    checkUsername,
    checkHandle,
    checkBio,
    secure_url,
    user
  );
  if (updateUserInDatabaseResponse?.error)
    return res.status(500).json(updateUserInDatabaseResponse);

  return res.status(200).json({ success: "ok" });
}

const updateUserInDatabase = async (username, handle, bio, imageUrl, user) => {
  //connect to mongo
  try {
    const client = await mongoConnect();
    const updatedUser = await client
      .db()
      .collection("users")
      .updateOne(
        { _id: user._id },
        {
          $set: {
            name: {
              username,
              handle,
            },
            bio,
            image: imageUrl,
          },
        }
      );
    return { success: true };
  } catch (e) {
    return {
      error:
        "Something went wrong when updating. Please wait a moment and try again.",
    };
  }
};

const validateBio = (bio) => {
  if (!bio) return;

  const schema = Joi.object({
    bio: Joi.string().min(0).max(150),
  });

  const validate = schema.validate({ bio });

  if (validate.error)
    return {
      error: "Make sure bio isn't larger than 150 chracters and try again.",
    };

  return bio;
};

const validateHandle = (handle) => {
  handle = handle.trim();
  if (!handle[0] == "@") {
    handle = "@" + handle.substring(0);
  }
  const schema = Joi.object({
    handle: Joi.string().min(4).max(20).required(),
  });
  const validate = schema.validate({ handle });
  const regexp = /^@[\w\s]{3,20}$/;
  const regexpCheck = regexp.test(handle);

  if (!regexpCheck || validate?.error)
    return {
      error:
        "Handle must be at least 3 charaters (20 max) and contain only alphanumeric ( a-z, 0-9 ), underscore ( _ ) and deciaml ( . ) characters.",
    };

  return handle;
};

const validateUsername = (username) => {
  username = username.trim();
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
  });
  const validate = schema.validate({ username });
  const regexp = /^[\w\s.]{3,20}$/;
  const regexpCheck = regexp.test(username);

  if (!regexpCheck || validate?.error)
    return {
      error:
        "Username must be at least 3 charaters (20 max) and contain only alphanumeric ( a-z, 0-9 ), underscore ( _ ) and deciaml ( . ) characters.",
    };

  return username;
};

const addFileToCloudinary = async ({ originialFileName, path }, user) => {
  //connect to cloudinary
  cloudinaryConfig();

  //upload
  try {
    const uploadResponse = await cloudinary.uploader.upload(path, {
      folder: `crypto-couch/${v4()}/profile-image`,
      overwrite: true,
      public_id: "profile-image",
    });

    return uploadResponse;
  } catch (e) {
    return { error: "Something happened during update, please try again." };
  }
};

const getUserFromMongodb = async (session) => {
  try {
    const client = await mongoConnect();
    const user = client
      .db()
      .collection("users")
      .findOne({ email: session.user.email });

    return user;
  } catch (e) {
    return { error: "Error happened during update. Please try again." };
  }
};

const validateFile = (file) => {
  const passedImageTypeCheck = imageTypeCheck(file.headers["content-type"]);
  if (!passedImageTypeCheck) return { error: "Invalid image type." };
  const passedImageSizeCheck = imageSizeCheck(file.size);
  if (!passedImageSizeCheck) return { error: "Image size too big." };

  return true;
};

const imageTypeCheck = (imageType) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  return allowedImageTypes.includes(imageType);
};

const imageSizeCheck = (imageSize) => {
  const allowedSize = 5000000;
  if (imageSize > allowedSize) {
    return false;
  }

  return true;
};

const createFormData = async (req) => {
  const form = new multiparty.Form();
  const data = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject({ err });
      } else {
        resolve({ fields, files });
      }
    });
  });

  return data;
};

export const config = {
  api: {
    bodyParser: false,
  },
};
