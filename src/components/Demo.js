import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

const schema = yup.object().shape({
  username: yup
    .string()
    .max(10, "Username must be at most 10 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .max(6, "Password must be at most 6 characters")
    .required("Password is required"),
  mobilenumber: yup
    .string()
    .matches(/^\d{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  selectedDate: yup
    .string()
    .test("is-valid-date", "Invalid date format", (value) => {
      return moment(value, "YYYY-MM-DD", true).isValid();
    })
    .required("Date is required"),
  gender: yup.string().required("Gender is required"),
  district: yup.string().required("District is required"),
  image: yup.mixed().required("Image is required"),
  files: yup.mixed().test("Required Image", "Please select a file", (value) => {
    return value && value.length;
  }),
});

const Demo = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      mobilenumber: "",
      selectedDate: "",
      gender: "",
      district: "",
      image: null,
      files: [],
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, watch, formState, reset, setValue } = form;
  const { errors } = formState;

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setValue("image", selectedImage);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    setValue("selectedDate", newDate);
  };

  const convert2base64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    data.selectedDate = moment(data.selectedDate).format("YYYY-MM-DD");
    if (data.files.length > 0) {
      convert2base64(data.files[0]);
    }
    console.log("Form data:", data);
    setMessage("Form submitted successfully");
    setOpen(true);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h4 className="mt-5">Form Validations</h4>
      <div className="register-form">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <TextField
              label="Username"
              variant="outlined"
              type="text"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="text"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Phone"
              variant="outlined"
              type="tel"
              {...register("mobilenumber")}
              error={!!errors.mobilenumber}
              helperText={errors.mobilenumber?.message}
            />
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Date"
              type="date"
              value={selectedDate}
              variant="outlined"
              error={!!errors.selectedDate}
              helperText={errors.selectedDate?.message}
              {...register("selectedDate")}
              onChange={handleDateChange}
            />

            
            {/* Image section */}
            {image ? <img src={image} width="450" alt="User" /> : null}

            <FormControl>
              <FormLabel className="text-start text-black mb-3">
                Select Image
              </FormLabel>
              <input
                type="file"
                id="fileupload"
                accept=".jpg, .jpeg, .png, .gif"
                {...register("files")}
                onChange={handleImageChange}
              ></input>
              <label htmlFor="fileupload" style={{ cursor: "pointer" }}>
                {imageSelected ? (
                  <strong>{watch("files")[0]?.name || ""}</strong>
                ) : (
                  ""
                )}
              </label>
            </FormControl>
            {errors.files && !imageSelected && (
              <FormHelperText error={true}>
                {errors.files.message}
              </FormHelperText>
            )}

            {/* Gender radio buttons */}
            <FormControl component="fieldset">
              <FormLabel className="text-start text-black" component="legend">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                id="gender"
                {...register("gender")}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
              {/* Error and helper text for gender */}
              {errors.gender && (
                <FormHelperText error={true}>
                  {errors.gender.message}
                </FormHelperText>
              )}
            </FormControl>

            {/* Select Dropdown */}
            <FormControl variant="outlined" error={!!errors.district}>
              <InputLabel>District</InputLabel>
              <Select label="District" {...register("district")}>
                <MenuItem value="">Select a District</MenuItem>
                <MenuItem value="coimbatore">Coimbatore</MenuItem>
                <MenuItem value="salem">Salem</MenuItem>
                <MenuItem value="erode">Erode</MenuItem>
                {/* Add more districts as needed */}
              </Select>
              {errors.district && (
                <FormHelperText error={true}>
                  {errors.district.message}
                </FormHelperText>
              )}
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Stack>
        </form>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="success" onClose={handleClose}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Demo;
