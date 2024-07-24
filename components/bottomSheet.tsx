import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteLocations } from '../hooks/useInfiniteLocations';

const CustomBottomSheet: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['20%', '50%', '100%'], []);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status,
    error
  } = useInfiniteLocations();

  // console.log('InfiniteQuery status:', status);
  // console.dir('InfiniteQuery data:', data);
  // console.log('InfiniteQuery error:', error);

  const locations = useMemo(() => 
    data?.pages.flatMap(page => page.data) ?? [], 
    [data]
  );
  console.log('Flattened locations:', locations);

  const handleSheetChanges = useCallback((index: number) => {
   // console.log('handleSheetChanges', index);
  }, []);

  const renderItem = useCallback(({ item }:any) => (
    <View style={styles.locationItem}>
      <Text style={styles.locationName}>{item.name}</Text>
      <Text style={styles.locationCoords}>{item.latitude}, {item.longitude}</Text>
    </View>
  ), []);

  const listFooterComponent = useCallback(() => {
    if (!hasNextPage) return null;
    return (
      <View style={styles.footerContainer}>
        {isFetchingNextPage ? (
          <ActivityIndicator color="#8e44ad" />
        ) : (
          <TouchableOpacity onPress={() => fetchNextPage()} style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const categories = [
    { id: 'foryou', icon: '🟣', label: 'For you' },
    { id: 'restaurants', icon: '🍽️', label: 'Restaurants' },
    { id: 'parties', icon: '🎉', label: 'Parties' },
    { id: 'breweries', icon: '🍺', label: 'Breweries' },
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <SafeAreaView style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryButton}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <BottomSheetFlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={listFooterComponent}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#1e1e1e',
  },
  handleIndicator: {
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 25,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#8e44ad',
    borderRadius: 20,
    padding: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#3a2a2a'
  },
  categoryButton: {
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    color: '#fff',
    fontSize: 12,
  },
  listContainer: {
    paddingTop: 16,
  },
  locationItem: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  locationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationCoords: {
    color: '#ccc',
    fontSize: 14,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#8e44ad',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomBottomSheet;