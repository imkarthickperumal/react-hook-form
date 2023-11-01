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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import moment from "moment";

type FormValues = {
  username: string;
  email: string;
  password: string;
  mobilenumber: string;
  selectedDate: string;
  gender: string;
  district: string;
};

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
});

const RegistrationForm = () => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      mobilenumber: "",
      selectedDate: "",
      gender: "",
      district: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (fileInput.files && fileInput.files.length > 0) {
      setSelectedImage(fileInput.files[0]);
    } else {
      setSelectedImage(null);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
    reset();
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

            {/* Image upload field */}
            <FormControl>
              <FormLabel className="text-start text-black mb-3">
                Select Image
              </FormLabel>
              <input
                type="file"
                id="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={handleImageChange}
              ></input>
            </FormControl>

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
      </div>
    </>
  );
};

export default RegistrationForm;
