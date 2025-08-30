import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselImage {
  id: string;
  uri: string;
  title: string;
  description: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  height?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, height = 300 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useTheme();
  const navigation = useNavigation<any>();
  
  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setActiveIndex(index);
  };

  return (
    <View style={[styles.container, { height }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <View key={image.id} style={[styles.slide, { width: screenWidth }]}>
            <Image 
              source={typeof image.uri === 'number' ? image.uri : { uri: image.uri }}
              style={[styles.image, { height }]} 
              resizeMode="cover"
            />
            <View style={styles.blackTint} />
          </View>
        ))}
      </ScrollView>
      
      {/* View Services Button - Centered */}
      <View style={styles.centerButtonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Services')}
          style={styles.viewServicesButton}
          contentStyle={styles.buttonContent}
          textColor="white"
        >
          View Services
        </Button>
      </View>
      
      {/* Pagination Indicators */}
      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === activeIndex 
                  ? theme.colors.primary 
                  : theme.colors.outline,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  blackTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  centerButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  viewServicesButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 6,
  },
  buttonContent: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageCarousel;
