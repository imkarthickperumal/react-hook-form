import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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
  selectedDate: yup.string().required("Date is required"),
  gender: yup.string().required("Gender is required"),
  district: yup.string().required("District is required"),
  files: yup.mixed().test("Required Image", "Please select a file", (value) => {
    return value && value.length;
  }),
});

const ModalForm = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [imageSelected, setImageSelected] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");

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

  const { control, register, watch, handleSubmit, formState, reset, setValue } = form;
  const { errors } = formState;

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setValue("image", selectedImage);
    setImageSelected(true);
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
      console.log(image);
    }
    console.log("Form data:", data);
    setMessage("Form submitted successfully");
    setOpen(true);
    reset();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <h4 style={{ marginTop: "10%" }}>Form Validations</h4>
      <div className="register-form">
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Open Form
        </Button>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>User Form</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={2} width={500}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      className="mt-4"
                      label="Username"
                      variant="outlined"
                      type="text"
                      {...field}
                      error={!!errors.username}
                      helperText={errors.username?.message}
                    />
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Email"
                      variant="outlined"
                      type="text"
                      {...field}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
                <Controller
                  name="mobilenumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Phone"
                      variant="outlined"
                      type="tel"
                      {...field}
                      error={!!errors.mobilenumber}
                      helperText={errors.mobilenumber?.message}
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      label="Password"
                      variant="outlined"
                      type="password"
                      {...field}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
                <Controller
                  name="selectedDate"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      type="date"
                      variant="outlined"
                      error={!!errors.selectedDate}
                      helperText={errors.selectedDate?.message}
                      {...field}
                    />
                  )}
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
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <FormLabel
                        className="text-start text-black"
                        component="legend"
                      >
                        Gender
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-label="gender"
                        id="gender"
                        {...field}
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
                  )}
                />

                {/* Select Dropdown */}
                <Controller
                  name="district"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl variant="outlined" error={!!errors.district}>
                      <InputLabel>District</InputLabel>
                      <Select label="District" {...field}>
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
                  )}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Stack>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert severity="success" onClose={handleClose}>
            {message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default ModalForm;
