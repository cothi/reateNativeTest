import * as Location from "expo-location"
import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from "react-native";



// get screen size
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// open weather api key
const API_KEY = "YOUR_API_KEY";


export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    // get latitude and longitude
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });


    // get location based on latitude and lognitude
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    );

    // set city
    setCity(location[0].city);


    // get weather 
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await res.json();
    console.log(json)
    setDays(json.daily);
  };

  // when first render, get location
  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>
          {city}
        </Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day} >
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />

          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text styles={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.description}> {day.weather[0].main} </Text>
              <Text style={styles.tinyText}> {day.weather[0].description} </Text>
            </View>
          ))
        )}

      </ScrollView >
    </View >
  );
}


// set css 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center"
  },
  temp: {
    marginTop: 50,
    fontWidth: "600",
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  },
});
