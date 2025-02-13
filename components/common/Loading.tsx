import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Package } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  withDelay
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const LoadingScreen = () => {
  // Rotating animation for the icon
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{
      rotate: withRepeat(
        withTiming(`${360}deg`, { duration: 2000 }),
        -1,
        true
      )
    }]
  }));

  // Progress bar animation
  const barStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withRepeat(
        withSequence(
          withTiming(-width, { duration: 0 }),
          withTiming(width, { duration: 1500 })
        ),
        -1,
        true
      )
    }]
  }));

  // Pulse animation for the title
  const titleStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    )
  }));

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#FFFFFF',
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        height: 2
      }}>
        <Animated.View style={[{
          width: 100,
          height: '100%',
          backgroundColor: '#EAB308', // yellow-500
          opacity: 0.7
        }, barStyle]} />
      </View>

      <Animated.View style={iconStyle}>
        <Package color="#EAB308" size={64} /> {/* yellow-500 */}
      </Animated.View>
      
      <Animated.Text style={[{ 
        color: '#422006', // yellow-900
        fontSize: 28,
        fontWeight: '600',
        marginTop: 24,
        letterSpacing: 1
      }, titleStyle]}>
        WarehouseOps
      </Animated.Text>
      
      <Text style={{ 
        color: '#854D0E', // yellow-800
        marginTop: 12,
        fontSize: 16,
        letterSpacing: 0.5
      }}>
        Loading...
      </Text>

      {/* Subtle shadow under the icon */}
      <View style={{
        position: 'absolute',
        shadowColor: '#EAB308',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5
      }} />
    </View>
  );
};

export default LoadingScreen;