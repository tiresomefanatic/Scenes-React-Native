import React, { useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

interface VideoItem {
  id: string;
  videoUri: string;
  user: {
    username: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
}

const { width, height } = Dimensions.get('window');

const VideoFeed: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const flatListRef = useRef<FlatList<VideoItem>>(null);
  const bottomTabHeight = useBottomTabBarHeight();
  const screenHeight = height - bottomTabHeight;

  const dummyData: VideoItem[] = [
    {
      id: '1',
      videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      user: {
        username: 'adventureSeeker',
        avatar: 'https://randomuser.me/api/portraits/women/64.jpg',
      },
      description: 'Exploring hidden waterfalls! 🏞️ #NatureLovers #Adventure',
      likes: 15400,
      comments: 342,
    },
    {
      id: '2',
      videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      user: {
        username: 'foodie_delights',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      },
      description: 'Homemade pasta recipe! 🍝 Who wants the secret sauce? #FoodTok #ItalianCuisine',
      likes: 28900,
      comments: 1203,
    },
    {
      id: '3',
      videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      user: {
        username: 'tech_guru',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      },
      description: 'Unboxing the latest smartphone! 📱 Is it worth the hype? #TechReview #Gadgets',
      likes: 42100,
      comments: 3576,
    },
    {
      id: '4',
      videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      user: {
        username: 'fitness_freak',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
      },
      description: '30-day abs challenge starts now! 💪 Who\'s with me? #FitnessMotivation #WorkoutRoutine',
      likes: 67800,
      comments: 5421,
    },
  ];

  const renderVideoItem = useCallback(({ item, index }: { item: VideoItem; index: number }) => {
    const isActive = index === activeVideoIndex;

    return (
      <View style={[styles.videoContainer, { height: screenHeight }]}>
        <Video
          source={{ uri: item.videoUri }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          isMuted={false}
          useNativeControls={false}
        />
        <View style={styles.overlay}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.stats}>
            <Text style={styles.statsText}>❤️ {item.likes}</Text>
            <Text style={styles.statsText}>💬 {item.comments}</Text>
          </View>
        </View>
      </View>
    );
  }, [activeVideoIndex, screenHeight]);

  const onViewableItemsChanged = useRef(({ changed }: { changed: any }) => {
    if (changed && changed.length > 0) {
      setActiveVideoIndex(changed[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <FlatList
      ref={flatListRef}
      data={dummyData}
      renderItem={renderVideoItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToInterval={screenHeight}
      snapToAlignment="start"
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    width: '100%',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingBottom: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: 'white',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
  },
  statsText: {
    color: 'white',
    marginRight: 20,
  },
  contentContainer: {
    paddingBottom: 120,
  },
});

export default VideoFeed;