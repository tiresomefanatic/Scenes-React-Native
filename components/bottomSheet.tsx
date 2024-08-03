import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Keyboard,
  KeyboardEvent
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteLocations } from '../hooks/useInfiniteLocations';
import {Image} from 'expo-image'

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CustomBottomSheet: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '90%'], []);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage
  } = useInfiniteLocations();

  const locations = useMemo(() => 
    data?.pages.flatMap(page => page.data) ?? [], 
    [data]
  );

  console.log('card-item',data)

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    if (index === 0) {
      // Bottom sheet is at its lowest point (20%)
      Keyboard.dismiss();
    }
  }, []);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      handleKeyboardShow
    );
    // const keyboardWillHideListener = Keyboard.addListener(
    //   'keyboardWillHide',
    // //  handleKeyboardHide
    // );

    return () => {
      keyboardWillShowListener.remove();
     // keyboardWillHideListener.remove();
    };
  }, []);

  const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
    bottomSheetRef.current?.expand();
  }, []);

  // const handleKeyboardHide = useCallback(() => {
  //   bottomSheetRef.current?.snapToIndex(0); // Snap to the lowest point (20%)
  // }, []);

  const categories = [
    { id: 'favorites', label: 'Favourites', image:'https://openmoji.org/data/color/svg/1F31F.svg' },
    { id: 'restaurants', label: 'Restaurants', image:'https://openmoji.org/data/color/svg/1F37D.svg' },
    { id: 'cafes', label: 'Cafes', image:'https://openmoji.org/data/color/svg/2615.svg' },
    { id: 'parks', label: 'Parks', image:'https://openmoji.org/data/color/svg/1F333.svg' },
    { id: 'sports', label: 'Sports', image:'https://openmoji.org/data/color/svg/1F3C0.svg' },
    { id: 'adventure', label: 'Adventure', image:'https://openmoji.org/data/color/svg/1FA82.svg' },
    { id: 'entertainment', label: 'Entertainment', image:'https://openmoji.org/data/color/svg/1F4FD.svg' },
    { id: 'shopping', label: 'Shopping', image:'https://openmoji.org/data/color/svg/1F6D2.svg' },

  ];

  const renderCategoryItem = useCallback(({ item }: any) => (
    <TouchableOpacity key={item.id} style={styles.categoryButton}>
      <Image source={item.image} style={{height:24, width:24}} />
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </TouchableOpacity>
  ), []);

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


  const renderLocationItem = useCallback(({ item }: any) => (
    <View style={styles.locationItem}>
   {/* Location Details */}
      <View style={styles.locationCardTop}>
        <View style={styles.CardTopLeft}>
          <Image
          style={styles.locationImage}
          source={item.displayPicture}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
          />
          <View style={styles.locationDetails}>
          <Text style={styles.locationName}>{item.name}</Text>
          <Text style={styles.locationCategory}>Category</Text>
          <Text style={styles.locationDistance}>2.5km</Text>
          </View>
        </View>
      </View>
  {/* Location Clips */}
      <View style={styles.locationCardBottom}>
        <View style={styles.clipThumbnail}></View>
        <View style={styles.clipThumbnail}></View>
        <View style={styles.clipThumbnail}></View>
        <View style={styles.clipThumbnail}></View>
      </View>
    </View>
  ), []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.contentContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Places"
            placeholderTextColor="#999"
          />
        </View>
        
        {/* Category List */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesList}
        >
          {categories.map((item) => renderCategoryItem({ item }))}
        </ScrollView>
        
        {/* Location List */}
        <BottomSheetFlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.locationsList}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
  },
  handleIndicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
    fontSize: 16,
  },
  categoriesList: {
    maxHeight: 40,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    flexDirection:'row',
    gap:8
  },
  categoryLabel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  locationImage:{
    height:64,
    width:64,
    borderRadius:8,
    marginRight:8,
    resizeMode:'cover',
  },
  locationsList: {
    paddingTop: 8,
  },
  locationItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection:'column',
    alignItems:'flex-start',
    gap: 12
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  locationCategory: {
    fontSize: 14,
    color: '#666',
    // marginTop: 4,
  },
  locationDistance:{
    fontSize: 14,
    color: '#666',
  },

  locationCardTop:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    gap:4
  },
  locationDetails:{
    flexDirection:'column'
  },
  locationCardBottom:{
    flexDirection:'row',
    justifyContent:'space-between',
    gap:4
  },
  CardTopLeft:{
    flexDirection:'row',
    alignItems:'center',
  },
  clipThumbnail:{
    width: 80,
    height: 140,
    borderRadius: 8,
    backgroundColor:'orange'
  }
});

export default CustomBottomSheet;