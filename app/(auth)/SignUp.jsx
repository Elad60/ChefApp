import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../components/FormField";
import { useState, useEffect, React } from "react";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();

  // Validate form fields whenever they change
  useEffect(() => {
    validateForm();
  }, [form]);

  // Validation function
  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Username validation
    if (form.username.trim() === "") {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
      isValid = false;
    }

    // Email validation
    if (form.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (form.password === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        form.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
      isValid = false;
    }

    // Confirm password validation
    if (form.confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    setFormValid(isValid);
    return isValid;
  };

  const submit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please check all fields and try again");
      return;
    }

    setIsSubmiting(true);
    try {
      // Sanitize input data before sending
      const sanitizedUsername = form.username.trim();
      const sanitizedEmail = form.email.trim().toLowerCase();

      const result = await createUser(
        sanitizedEmail,
        form.password,
        sanitizedUsername
      );
      setUser(result);
      setIsLoggedIn(true);
      router.replace("/home");
    } catch (error) {
      // Improved error handling with more specific messages
      let errorMessage = "Registration failed. Please try again.";

      if (error.message.includes("email")) {
        errorMessage = "This email is already registered or invalid.";
      } else if (error.message.includes("username")) {
        errorMessage = "This username is already taken or invalid.";
      } else if (error.message.includes("password")) {
        errorMessage = "Password does not meet security requirements.";
      }

      Alert.alert("Registration Error", errorMessage);
    } finally {
      setIsSubmiting(false);
    }
  };

  // Error message display component
  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <Text className="text-red-500 text-sm mt-1">{message}</Text>;
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Sign Up to ChefMatch
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-7"
          />
          <ErrorMessage message={errors.username} />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ErrorMessage message={errors.email} />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
          />
          <ErrorMessage message={errors.password} />

          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
          />
          <ErrorMessage message={errors.confirmPassword} />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmiting}
            disabled={!formValid || isSubmiting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/SignIn"
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
