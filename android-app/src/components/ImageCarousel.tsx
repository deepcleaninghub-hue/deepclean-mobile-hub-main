import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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

// Constants
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds
const SCROLL_THROTTLE = 100; // 100ms throttle for better performance

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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useTheme();
  const navigation = useNavigation<any>();
  
  // Memoize images length to prevent unnecessary re-renders
  const imagesLength = useMemo(() => images.length, [images.length]);
  
  // Auto-play functionality - FIXED: Removed activeIndex from dependencies
  useEffect(() => {
    if (imagesLength <= 1) return; // Don't auto-scroll if only one image
    
    intervalRef.current = setInterval(() => {
      setActiveIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % imagesLength;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [imagesLength]); // Only depend on imagesLength, not activeIndex

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback((event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    
    // Only update if index actually changed
    setActiveIndex(prevIndex => {
      if (prevIndex !== index && index >= 0 && index < imagesLength) {
        return index;
      }
      return prevIndex;
    });
  }, [imagesLength]);

  // Memoized navigation handler
  const handleViewServices = useCallback(() => {
    navigation.navigate('Services');
  }, [navigation]);

  // Memoized pagination dots
  const paginationDots = useMemo(() => {
    return images.map((_, index) => (
      <View
        key={index}
        testID="pagination-dot"
        style={[
          styles.paginationDot,
          {
            backgroundColor: index === activeIndex 
              ? theme.colors.primary 
              : theme.colors.outline,
          },
        ]}
      />
    ));
  }, [images, activeIndex, theme.colors.primary, theme.colors.outline]);

  return (
    <View style={[styles.container, { height }]} testID="image-carousel">
      <ScrollView
        ref={scrollViewRef}
        testID="scroll-view"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={SCROLL_THROTTLE}
        style={styles.scrollView}
        decelerationRate="fast"
        bounces={false}
      >
        {images.map((image, index) => (
          <View key={image.id} style={[styles.slide, { width: screenWidth }]}>
            <Image 
              source={typeof image.uri === 'number' ? image.uri : { uri: image.uri }}
              style={[styles.image, { height }]} 
              resizeMode="cover"
              onError={() => console.warn(`Failed to load image: ${image.uri}`)}
            />
            <View style={styles.blackTint} />
          </View>
        ))}
      </ScrollView>
      
      {/* View Services Button - Centered */}
      <View style={styles.centerButtonContainer}>
        <Button
          mode="outlined"
          onPress={handleViewServices}
          style={styles.viewServicesButton}
          contentStyle={styles.buttonContent}
          textColor="white"
        >
          View Services
        </Button>
      </View>
      
      {/* Pagination Indicators */}
      <View style={styles.paginationContainer}>
        {paginationDots}
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
