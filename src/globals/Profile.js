import Button from "./Button";
import styled from "styled-components";
import { BsCamera } from "react-icons/bs";
import Image from "next/image";
import FormInput from "./FormInput";
import Spacer from "./Spacer";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Profile = ({ genHandle, genName }) => {
  //ROUTER
  const router = useRouter();

  //STATE
  const [data, setData] = useState({
    username: {
      value: genName,
      maxLength: 20,
      limit: genName.length,
    },
    handle: {
      value: `@${genHandle}`,
      maxLength: 21,
      limit: genHandle.length,
    },
    bio: { value: "", maxLength: 150, limit: 0 },
  });
  const [error, setError] = useState({
    username: "",
    handle: "",
    bio: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(null);

  const [highlightBox, setHighlightBox] = useState({
    username: false,
    handle: false,
    bio: false,
  });

  const [handlingError, setHandlingError] = useState({});

  const [form, setForm] = useState({});

  const [pageComplete, setPageComplete] = useState(null);

  //FUNCTIONS
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validated = validateFile(file);

    if (validated.error) {
      return setError((prevState) => {
        return {
          ...prevState,
          image: validated.error,
        };
      });
    }

    if (!error.image == "") {
      setError((prevState) => {
        return {
          ...prevState,
          image: "",
        };
      });
    }

    getFilePreview(file);
    setForm(file);
  };

  const validateFile = (file) => {
    const allowedExtensions = ["jpeg", "jpg", "png", "webp"];
    const extensionArray = file && file.name && file.name.split(".");
    const extension = extensionArray[extensionArray.length - 1].toLowerCase();
    // validate extension
    if (!allowedExtensions.includes(extension))
      return {
        error:
          "Your profile image only accepts .jpg, .jpeg, .png, and .webp images.",
      };
    // validate size
    if (file.size > 5000000)
      return {
        error: `The image you're trying to upload is ${(
          file.size / 1000000
        ).toPrecision(3)}MB. The limit is 5MB.`,
      };

    return true;
  };

  const getFilePreview = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (err) => {
      return err;
    };
    reader.onload = (data) => {
      setImagePreview(data.target.result);
    };
  };

  const createFormData = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", data.username.value);
    formData.append("handle", data.handle.value);
    formData.append("bio", data.bio.value);
    return formData;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = createFormData(form);
      const response = await fetch("/api/cloudinary/upload-image", {
        method: "POST",
        body: formData,
      });

      setPageComplete(await response.json());
    } catch (error) {
      setHandlingError(error);
      setLoading(false);
    }
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    if ([e.target.name] == "handle") {
      const regexp = /^@[\w]{3,20}$/;
      const test = regexp.test(value);
      if (!test) {
        setHighlightBox((prevState) => {
          return {
            ...prevState,
            [e.target.name]: false,
          };
        });
        setError((prevState) => {
          return {
            ...prevState,
            [e.target.name]:
              "Handle must be at least 3 characters (16 max), have no spaces, and contain one '@' symbol at the beginning. You may use underscores (_) but no other special characters are aloud.",
          };
        });
      } else {
        setError((prevState) => {
          return {
            ...prevState,
            [e.target.name]: "",
          };
        });
        setHighlightBox((prevState) => {
          return {
            ...prevState,
            [e.target.name]: true,
          };
        });
      }
    }

    if ([e.target.name] == "username") {
      const regexp = /^[\w\s.]{3,20}$/;
      const test = regexp.test(value);
      if (!test) {
        setHighlightBox((prevState) => {
          return {
            ...prevState,
            [e.target.name]: false,
          };
        });
        setError((prevState) => {
          return {
            ...prevState,
            [e.target.name]:
              "Username must be at least 3 charaters (20 max) and contain only alphanumeric ( a-z, 0-9 ), underscore ( _ ) and deciaml ( . ) characters.",
          };
        });
      } else {
        setError((prevState) => {
          return {
            ...prevState,
            [e.target.name]: "",
          };
        });
        setHighlightBox((prevState) => {
          return {
            ...prevState,
            [e.target.name]: true,
          };
        });
      }
    }
    if ([e.target.name] == "bio") {
      setHighlightBox((prevState) => {
        return {
          ...prevState,
          [e.target.name]: true,
        };
      });
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if ([e.target.name] == "handle") {
      val = val.replace(/[^\w]$/, "");
      val = "@" + val.substring(1);
    }

    if ([e.target.name] == "username") {
      val = val.replace(/[^\w\s.]/, "");
    }

    setData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: {
          ...prevState[e.target.name],
          value: val,
          limit:
            prevState[e.target.name].maxLength +
            val.length -
            prevState[e.target.name].maxLength,
        },
      };
    });
  };

  //EFFECTS
  useEffect(() => {
    if (pageComplete?.success == "ok") {
      router.push("/chat/btcusd");
    }
  }, [pageComplete]);

  return (
    <ProfileWrapper>
      <ImageWrapper>
        <ProfileImage
          src={imagePreview || "/images/elon.jpg"}
          height={200}
          width={200}
          objectFit={"contain"}
        />
        <label htmlFor="upload">
          <UploadIcon>
            <BsCamera color="#fff" size={"2rem"} />
          </UploadIcon>
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          id="upload"
          onChange={handleImageUpload}
        />
      </ImageWrapper>
      {error.image && <FormError>{error.image}</FormError>}
      <form onSubmit={onSubmit}>
        <Spacer direction={"top"} space={"0.5rem"} />
        <FormInput
          label={"Username (Required)"}
          name="username"
          placeholder={"example123"}
          maxLength={data.username.maxLength}
          required
          value={data.username.value}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength={3}
          limiter
          limit={data.username.limit}
          highlightBox={highlightBox.username}
        />
        {error.username && <FormError>{error.username}</FormError>}
        <Spacer direction={"top"} space={"0.5rem"} />
        <FormInput
          label={"Handle (Required)"}
          name="handle"
          placeholder={"(i.e. @example)"}
          maxLength={data.handle.maxLength}
          required
          value={data.handle.value}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength={4}
          limiter
          limit={data.handle.limit}
          highlightBox={highlightBox.handle}
        />
        {error.handle && <FormError>{error.handle}</FormError>}
        <Spacer direction={"top"} space={"0.5rem"} />
        <FormInput
          label={"Bio (Optional)"}
          name="bio"
          maxLength={data.bio.maxLength}
          value={data.bio.value}
          onChange={handleChange}
          onBlur={handleBlur}
          limiter
          limit={data.bio.limit}
          highlightBox={highlightBox.bio}
        />
        <Spacer direction={"top"} space={"1rem"} />
        <Button
          disabled={error.handle !== "" || error.username !== "" || loading}
          type={"submit"}
          width={100}
          text="Update"
          loading={loading}
        />
      </form>
    </ProfileWrapper>
  );
};

const ProfileWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;

  form {
    width: 100%;
  }
`;

const FormError = styled.p`
  color: #d87171;
  font-size: 1rem;
`;

const UploadIcon = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 100%;
  padding: 0.5rem;
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  position: relative;

  label {
    position: absolute;
    bottom: 5px;
    left: 5px;
  }
`;

const ProfileImage = styled(Image)`
  border-radius: 5px;
`;

export default Profile;
