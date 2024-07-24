export interface Location {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    displayPicture: string;
    insta: string;
    createdAt: Date;
    categories: string[]; // Assuming categories is an array of strings
  }
  
  export interface User {
    id: string;
    name: string;
    // Add other user properties
  }