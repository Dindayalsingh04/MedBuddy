import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView ,Alert , TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMealData } from '../mealtime/MealTimeLogic'; // Use the custom hook for meal data management
import ImageUploader from '../components/ImageUploader'; // Import the ImageUploader component
import * as Clipboard from 'expo-clipboard';


const handleCopy = async () => {
  try {
    // Using setStringAsync instead of the deprecated setString
    await Clipboard.setStringAsync(JSON.stringify(uploadedImageData, null, 2));
    Alert.alert('Copied to Clipboard!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    Alert.alert('Failed to copy to clipboard');
  }
};

const HomeScreen = ({ route }) => {
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const [uploadedImageData, setUploadedImageData] = useState(null);

  // Ensure userId is available before proceeding
  if (!userId) {
    return <Text>User ID not found!</Text>;
  }

  // Use the custom hook to fetch meal data and provide update functionality
  const { totalMeals, mealTimes, updateMealData } = useMealData(userId);

  // Function to render meal slots based on totalMeals and mealTimes
  const renderMealSlots = () => {
    const slotsToRender = mealTimes.slice(0, totalMeals); // Render meal slots up to the totalMeals count
    return slotsToRender.map((meal, index) => (
      <View key={index} style={styles.mealSlot}>
        <Text style={styles.mealText}>{meal.name} Meal: {meal.time}</Text>
      </View>
    ));
  };

  const handleCopy = async () => {
    try {
      // Using setStringAsync instead of the deprecated setString
      await Clipboard.setStringAsync(JSON.stringify(uploadedImageData, null, 2));
      Alert.alert('Copied to Clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      Alert.alert('Failed to copy to clipboard');
    }
  };

  // Callback function to handle OCR detection results
  const handleResult = (data) => {
    console.log('OCR Detections from server:', data);
    // Handle OCR result here (e.g., updating meal data or setting reminders)
    setUploadedImageData(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Meal Schedule Box */}
      <View style={styles.scheduleBox}>
        <Text style={styles.scheduleTitle}>Your Meal Schedule:</Text>

        {/* Meal Slots */}
        <View style={styles.mealScheduleContainer}>
          {renderMealSlots()}
        </View>

        {/* Edit Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Edit Meal Times"
            onPress={() =>
              navigation.navigate('MealTimeEdit', {
                userId,
                updateMealData, // Pass the userId and updateMealData function
              })
            }
          />
        </View>
      </View>

      {/* Welcome Header */}
      <Text style={styles.headerText}>Welcome to Home Screen, User: {userId}</Text>

      {/* Image Uploader */}
      <View style={styles.uploaderBox}>
        <Text style={styles.uploaderTitle}>Upload Prescription Sticker:</Text>
        <ImageUploader onResult={handleResult} />
      </View>

      {/* Display Uploaded OCR Data */}
      {uploadedImageData && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>OCR Detection Results:</Text>
            console.log('OCR Detections from server:', JSON.stringify(uploadedImageData, null, 2));
            <TouchableOpacity onPress={handleCopy}>
              <Text style={styles.resultText}>
                {JSON.stringify(uploadedImageData, null, 2)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Align everything to the top
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark color for the header
  },
  scheduleBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds shadow on Android devices
    marginTop: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  mealScheduleContainer: {
    marginBottom: 20,
  },
  mealSlot: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  mealText: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 10,
  },
  uploaderBox: {
    backgroundColor: '#ffffff', // White background
    padding: 20,
    borderRadius: 15, // Rounded corners
    marginVertical: 15, // Spacing around the box
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow transparency
    shadowRadius: 4, // Shadow spread
    elevation: 5, // Android shadow
    alignItems: 'center', // Center content
  },
  uploaderTitle: {
    fontSize: 18, // Font size
    fontWeight: 'bold', // Bold text
    color: '#4CAF50', // Green color matching buttons
    marginBottom: 10, // Spacing below the title
    fontFamily: 'sans-serif', // Clean, modern font
    textAlign: 'center', // Center-align the text
  },
  resultBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eef',
    borderRadius: 10,
    width: '100%',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#444',
  },
});

export default HomeScreen;
