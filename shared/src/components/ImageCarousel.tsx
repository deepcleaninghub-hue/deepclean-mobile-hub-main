/**
 * Image Carousel Component
 * 
 * A performant image carousel with auto-play and manual navigation.
 * Optimized for performance with real images from original apps.
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
} from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

// Constants
const AUTO_SCROLL_INTERVAL = 3000; // 3 seconds
const SCROLL_THROTTLE = 100; // 100ms throttle for better performance

interface CarouselImage {
  id: string;
  uri: any;
  title: string;
  description: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showText?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 300,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showText = true,
}) => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Memoize images length to prevent unnecessary re-renders
  const imagesLength = useMemo(() => images.length, [images.length]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    
    // Only update if index actually changed
    setCurrentIndex(prevIndex => {
      if (prevIndex !== index && index >= 0 && index < imagesLength) {
        return index;
      }
      return prevIndex;
    });
  }, [imagesLength]);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  }, []);

  // Auto-play functionality - optimized
  useEffect(() => {
    if (!isAutoPlaying || imagesLength <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % imagesLength;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, imagesLength, autoPlayInterval, scrollToIndex]);

  const handleTouchStart = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (autoPlay) {
      setTimeout(() => setIsAutoPlaying(true), 3000);
    }
  }, [autoPlay]);

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
            backgroundColor: index === currentIndex 
              ? theme.colors.primary 
              : theme.colors.outline,
          },
        ]}
      />
    ));
  }, [images, currentIndex, theme.colors.primary, theme.colors.outline]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { height }]} testID="image-carousel">
      <ScrollView
        ref={scrollViewRef}
        testID="scroll-view"
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={styles.scrollView}
        scrollEventThrottle={SCROLL_THROTTLE}
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
            
            {showText && (
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.textGradient}
              >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{image.title}</Text>
                  <Text style={styles.description}>{image.description}</Text>
                </View>
              </LinearGradient>
            )}
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
      {showDots && images.length > 1 && (
        <View style={styles.paginationContainer}>
          {paginationDots}
        </View>
      )}
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
  textGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
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

