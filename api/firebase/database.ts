import { collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { DatabaseService, PaginatedResponse, Location } from '../types/database';

export class FirebaseDatabaseService implements DatabaseService {
  async getLocations(cursor?: string, limitCount: number = 20): Promise<PaginatedResponse<Location>> {
    let q = query(
      collection(db, 'locations'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    if (cursor) {
      const cursorDoc = await getDoc(doc(db, 'locations', cursor));
      q = query(q, startAfter(cursorDoc));
    }

    const snapshot = await getDocs(q);
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      latitude: doc.data().latlong[0],
      longitude: doc.data().latlong[1],
      displayPicture: doc.data().display_picture,
      insta: doc.data().insta,
      createdAt: doc.data().created_at.toDate(),
      categories: doc.data().categories,
    } as Location));

    const nextCursor = snapshot.docs.length === limitCount ? snapshot.docs[snapshot.docs.length - 1].id : undefined;
   // console.log("docs legntg", snapshot.docs.length);

    return { data: locations, nextCursor };
  }
  // Implement other database methods as needed
}