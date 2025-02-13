import React, { useEffect, useRef, useCallback } from 'react';
import { View, Animated, PanResponder, Dimensions, BackHandler } from 'react-native';

const screenHeight = Dimensions.get('window').height;

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: number[];
  onClose: () => void;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  children, 
  snapPoints = [screenHeight * 0.9, screenHeight * 0.5], 
  onClose 
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const lastGestureDy = useRef(0);
  const currentSnapPoint = useRef(snapPoints[0]);
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentSnapPoint.current > 0) {
        handleClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);

  // Initial animations
  useEffect(() => {
    pan.setValue({ x: 0, y: screenHeight });
    Animated.parallel([
      Animated.spring(pan.y, {
        toValue: screenHeight - snapPoints[0],
        useNativeDriver: false,
        bounciness: 4,
        speed: 12
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(pan.y, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: false
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      onClose?.();
    });
  }, [onClose]);

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 5;
    },
    onPanResponderGrant: () => {
      pan.setOffset({
        x: 0,
        y: lastGestureDy.current
      });
    },
    onPanResponderMove: (_, gestureState) => {
      const newY = gestureState.dy;
      if (newY < 0 && pan.y._value <= screenHeight - snapPoints[0]) {
        pan.setValue({ x: 0, y: 0 });
        return;
      }
      pan.y.setValue(newY);
    },
    onPanResponderRelease: (_, gestureState) => {
      pan.flattenOffset();
      
      const currentPosition = screenHeight - (pan.y._value + lastGestureDy.current);
      let nextSnapPoint = snapPoints[0];
      let minDistance = Math.abs(currentPosition - snapPoints[0]);
      
      // Find nearest snap point
      snapPoints.forEach(point => {
        const distance = Math.abs(currentPosition - point);
        if (distance < minDistance) {
          minDistance = distance;
          nextSnapPoint = point;
        }
      });

      // Handle velocity-based snapping
      if (Math.abs(gestureState.vy) > 0.5) {
        if (gestureState.vy < 0) {
          // Moving up fast
          nextSnapPoint = snapPoints[0];
        } else {
          // Moving down fast
          const currentIndex = snapPoints.indexOf(nextSnapPoint);
          if (currentIndex < snapPoints.length - 1) {
            nextSnapPoint = snapPoints[currentIndex + 1];
          } else {
            handleClose();
            return;
          }
        }
      }

      // Close if pulled down past threshold
      if (currentPosition < snapPoints[snapPoints.length - 1] / 2) {
        handleClose();
        return;
      }

      // Animate to next snap point
      Animated.spring(pan.y, {
        toValue: screenHeight - nextSnapPoint,
        useNativeDriver: false,
        bounciness: 4,
        speed: 12
      }).start(() => {
        lastGestureDy.current = screenHeight - nextSnapPoint;
        currentSnapPoint.current = nextSnapPoint;
      });
    }
  })).current;

  return (
    <Animated.View 
      className="absolute inset-0 bg-black/50"
      style={{ opacity: backdropOpacity, zIndex: 9999 }}
    >
      <Animated.View
        style={{
          transform: [{ translateY: pan.y }],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: snapPoints[0],
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
          zIndex: 9999
        }}
      >
        <View 
          className="absolute inset-x-0 top-0 justify-center items-center z-10"
          {...panResponder.panHandlers}
        >
          <View className="w-16 h-1 bg-gray-300 rounded-full" />
        </View>
        
        <View className="flex-1 pt-9">
          {children}
        </View>
      </Animated.View>
    </Animated.View>
  );
};