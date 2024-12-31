import React, { useEffect, useState } from 'react';
import { View, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ImageUploader = ({ onResult }) => {
  const [imageUri, setImageUri] = useState(null);

  // Request permission when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need permission to access your media.');
      }
    })();
  }, []);

  const pickImage = async () => {
    // Check permission status before opening image picker
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permission to access your media.');
      return; // Exit if no permission
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Correct usage for Images
      allowsEditing: true,
      quality: 1,
    });

    console.log('Image Picker Result:', result); // Log the result to check what is returned

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // Accessing the correct property for URI
    } else {
      Alert.alert('Image Picker', 'No image selected.');
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert('Error', 'No image selected!');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      name: 'uploaded_image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://192.168.140.16:5000/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Server response:', response.data);

      // Ensure onResult is defined before calling it
      if (onResult && typeof onResult === 'function') {
        onResult(response.data);
      } else {
        console.warn('onResult is not defined or is not a function');
      }
    } catch (error) {
      console.error('Error uploading image:', error); // Log error for debugging
      Alert.alert('Error', 'Failed to process image.');
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Upload Image" onPress={() => uploadImage(imageUri)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  image: { width: 200, height: 200, marginBottom: 10 },
});

export default ImageUploader;