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
    { id: 'favorites', label: 'Favourites' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'cafes', label: 'Cafes' },
    { id: 'parks', label: 'Parks' },
  ];

  const renderCategoryItem = useCallback(({ item }: any) => (
    <TouchableOpacity key={item.id} style={styles.categoryButton}>
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </TouchableOpacity>
  ), []);

  const renderLocationItem = useCallback(({ item }: any) => (
    <View style={styles.locationItem}>
      <Text style={styles.locationName}>{item.name}</Text>
      <Text style={styles.locationAddress}>{item.address}</Text>
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
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Places"
            placeholderTextColor="#999"
          />
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
          style={styles.categoriesList}
        >
          {categories.map((item) => renderCategoryItem({ item }))}
        </ScrollView>
        
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
  },
  categoryLabel: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
  },
  locationsList: {
    paddingTop: 8,
  },
  locationItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default CustomBottomSheet;