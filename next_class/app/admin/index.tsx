import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const dummyData = [
  { id: 1, title: 'User Stats', description: 'View total and active users' },
  { id: 2, title: 'Roles Info', description: 'See available roles and permissions' },
  { id: 3, title: 'Departments', description: 'Manage department data' },
  { id: 4, title: 'Courses', description: 'Overview of all courses' },
];

export default function AdminHome() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= dummyData.length) {
        nextIndex = 0; 
      }
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]); 
  const onScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin!</Text>
      <Text style={styles.subtitle}>
        Use the drawer to manage users, roles, departments, and courses.
      </Text>

      <Text style={styles.sliderTitle}>Quick Overview</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
      >
        {dummyData.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  card: {
    width: width,
    height: 300,
    backgroundColor: '#cce5ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
   
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 16,
    textAlign: 'center',
  },
});
