
// src/lib/firebase.ts
// MOCK FIREBASE IMPLEMENTATION
import type { User as FirebaseUser } from 'firebase/auth'; // Keep this for type compatibility if needed

// Extend FirebaseUser with custom fields if needed
export interface User extends FirebaseUser {
  bio?: string;
  // Add other custom fields here if you store them on the user object itself
  // or prefer to merge them from a separate Firestore document.
}

// Helper to simulate a delay (can be removed in production)
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


// Mock Data
let mockUsers: User[] = [
  { uid: 'user1', email: 'user@example.com', displayName: 'Demo User', photoURL: 'https://placehold.co/100x100.png?text=DU', emailVerified: true } as User,
];

let mockCommunities = [
  { id: 'anxiety', name: 'Anxiety Support Group', description: 'A place to share and find support for anxiety.', icon: 'ShieldAlert', memberCount: 120, postCount: 45 },
  { id: 'depression', name: 'Depression & Low Mood', description: 'Connect with others who understand depression.', icon: 'CloudRain', memberCount: 90, postCount: 30 },
  { id: 'addiction', name: 'Addiction & Detox Support', description: 'Support for addiction recovery and digital detox.', icon: 'LifeBuoy', memberCount: 75, postCount: 22 },
  { id: 'self-growth', name: 'Self-Growth Journey', description: 'Share your journey of personal development.', icon: 'Sunrise', memberCount: 150, postCount: 60 },
  { id: 'general', name: 'General Wellness Chat', description: 'A space for general wellness discussions.', icon: 'MessageSquare', memberCount: 200, postCount: 70 },
];

let mockResources = [
  { id: 'res1', title: 'Understanding Anxiety', description: 'A comprehensive guide to understanding different types of anxiety.', type: 'Article', topic: 'Anxiety', contentUrl: '#' },
  { id: 'res2', title: 'Mindfulness Meditation for Beginners', description: 'Learn the basics of mindfulness meditation to calm your mind.', type: 'Video', topic: 'Mindfulness', contentUrl: '#' },
  { id: 'res3', title: 'Cognitive Behavioral Therapy (CBT) Techniques', description: 'Simple CBT exercises you can do at home.', type: 'Exercise', topic: 'CBT', contentUrl: '#' },
  { id: 'res4', title: 'Overcoming Procrastination', description: 'Strategies to beat procrastination and boost productivity.', type: 'Article', topic: 'Self-Growth', contentUrl: '#' },
  { id: 'res5', title: 'Building Healthy Habits', description: 'A video guide to forming and maintaining positive habits.', type: 'Video', topic: 'Habits', contentUrl: '#' },
  { id: 'res6', title: 'Journaling for Mental Clarity', description: 'Discover the benefits of journaling with these prompts.', type: 'Exercise', topic: 'Well-being', contentUrl: '#' },
  { id: 'res7', title: 'Managing Social Anxiety', description: 'Tips and techniques for navigating social situations.', type: 'Article', topic: 'Anxiety', contentUrl: '#' },
  { id: 'res8', title: 'Understanding Addiction Recovery', description: 'An introductory article on the stages of addiction recovery.', type: 'Article', topic: 'Addiction', contentUrl: '#' },
  { id: 'res9', title: '5-Minute Guided Meditation for Stress Relief', description: 'A short guided meditation video to quickly reduce stress.', type: 'Video', topic: 'Stress', contentUrl: '#' },
  { id: 'res10', title: 'Setting SMART Goals for Personal Development', description: 'Learn how to set achievable goals for self-growth.', type: 'Exercise', topic: 'Self-Growth', contentUrl: '#' },
  { id: 'res11', title: 'Coping with Depression: Daily Strategies', description: 'Practical strategies to help manage daily life with depression.', type: 'Article', topic: 'Depression', contentUrl: '#' },
  { id: 'res12', title: 'Digital Detox Challenge', description: 'A guided exercise to reduce screen time and improve well-being.', type: 'Exercise', topic: 'Detox', contentUrl: '#' },
];

let mockPosts = [
  { id: 'post1', communityId: 'anxiety', userId: 'user1', userName: 'AnxiousAndy', title: 'Feeling overwhelmed today', content: 'Just wanted to share that today feels particularly tough. Any tips for managing sudden waves of anxiety?', createdAt: new Date(Date.now() - 3600000).toISOString(), reactions: 15, commentsCount: 4, userAvatar: 'https://placehold.co/40x40.png?text=AA' },
  { id: 'post2', communityId: 'anxiety', userId: 'user2', userName: 'SupportiveSue', title: 'Re: Feeling overwhelmed', content: 'Deep breathing exercises always help me. Remember to be kind to yourself!', createdAt: new Date(Date.now() - 1800000).toISOString(), reactions: 22, commentsCount: 2, userAvatar: 'https://placehold.co/40x40.png?text=SS' },
  { id: 'post3', communityId: 'self-growth', userId: 'user3', userName: 'GrowthGuru', title: 'Small wins this week!', content: 'Managed to stick to my new morning routine for 3 days straight! Feeling proud.', createdAt: new Date(Date.now() - 7200000).toISOString(), reactions: 30, commentsCount: 5, userAvatar: 'https://placehold.co/40x40.png?text=GG' },
  { id: 'post-welcome-anxiety', communityId: 'anxiety', userId: 'admin', userName: 'WellVerse Admin', title: 'Welcome to the Anxiety Support Group!', content: 'This is a safe space to share your experiences and find support. We\'re glad you\'re here!', createdAt: new Date().toISOString(), reactions: 10, commentsCount: 1, userAvatar: 'https://placehold.co/40x40.png?text=WA' },
  { id: 'post-welcome-depression', communityId: 'depression', userId: 'admin', userName: 'WellVerse Admin', title: 'Welcome to Depression & Low Mood Support!', content: 'You are not alone. Feel free to share and connect with others who understand.', createdAt: new Date().toISOString(), reactions: 8, commentsCount: 0, userAvatar: 'https://placehold.co/40x40.png?text=WA' },
  { id: 'post-welcome-addiction', communityId: 'addiction', userId: 'admin', userName: 'WellVerse Admin', title: 'Welcome to Addiction & Detox Support!', content: 'This community is here to support you on your recovery journey. Share your thoughts and experiences.', createdAt: new Date().toISOString(), reactions: 7, commentsCount: 0, userAvatar: 'https://placehold.co/40x40.png?text=WA' },
  { id: 'post-welcome-self-growth', communityId: 'self-growth', userId: 'admin', userName: 'WellVerse Admin', title: 'Welcome to the Self-Growth Journey Group!', content: 'Let\'s grow together! Share your goals, challenges, and successes here.', createdAt: new Date().toISOString(), reactions: 12, commentsCount: 2, userAvatar: 'https://placehold.co/40x40.png?text=WA' },
];

let mockMoodEntries = [
  { id: 'mood1', userId: 'user1', mood: 'Happy', journal: 'Had a great day, feeling productive!', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'mood2', userId: 'user1', mood: 'Meh', journal: 'Just a regular day, nothing special.', date: new Date(Date.now() - 86400000 * 1).toISOString() },
];

// Mock Firestore
export const mockDb = {
  collection: (name: string) => {
    let data: any[];
    if (name === 'users') data = mockUsers;
    else if (name === 'communities') data = mockCommunities;
    else if (name === 'resources') data = mockResources;
    else if (name === 'posts') data = mockPosts;
    else if (name === 'moodEntries') data = mockMoodEntries;
    else data = [];

    return {
      get: async () => {
        await delay(300);
        return {
          docs: data.map(doc => ({
            id: doc.id,
            data: () => doc,
            exists: () => true, // For getDoc compatibility
          })),
          empty: data.length === 0,
        };
      },
      doc: (id: string) => {
        const doc = data.find(d => d.id === id);
        return {
          get: async () => {
            await delay(100);
            if (doc) {
              return {
                id: doc.id,
                data: () => doc,
                exists: () => true,
              };
            }
            return { exists: () => false, data: () => undefined };
          },
          set: async (newData: any) => { // For setDoc compatibility
            await delay(100);
            const index = data.findIndex(d => d.id === id);
            const fullData = { ...newData, id: id }; // ensure id is part of the stored data
            if (index > -1) {
              data[index] = fullData;
            } else {
              data.push(fullData);
            }
            return Promise.resolve();
          },
          update: async (updateData: any) => { // For updateDoc compatibility
             await delay(100);
            const index = data.findIndex(d => d.id === id);
            if (index > -1) {
              data[index] = { ...data[index], ...updateData };
            } else {
              return Promise.reject(new Error("Document not found for update"));
            }
            return Promise.resolve();
          }
        };
      },
      where: (field: string, operator: string, value: any) => {
        // Simplified mock 'where' that only supports '=='
        if (operator === '==') {
          const filteredData = data.filter(doc => doc[field] === value);
          return {
            orderBy: (/*orderByField: string, direction: string = 'asc'*/) => { // Simplified orderBy
              // Mock orderBy doesn't re-sort for simplicity here but real Firestore would.
              // For 'createdAt' desc, we can sort if it's posts
              let sortedData = [...filteredData];
              if (name === 'posts' && field === 'communityId' /* && orderByField === 'createdAt' && direction === 'desc' */) {
                 sortedData.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
              }
              return {
                limit: (/*limitNum: number*/) => { // Simplified limit
                   return {
                      get: async () => {
                        await delay(200);
                        return {
                          docs: sortedData.map(doc => ({ id: doc.id, data: () => doc, exists: () => true })),
                          empty: sortedData.length === 0,
                        };
                      }
                   }
                },
                get: async () => {
                  await delay(200);
                   return {
                     docs: sortedData.map(doc => ({ id: doc.id, data: () => doc, exists: () => true })),
                     empty: sortedData.length === 0,
                   };
                }
              }
            },
            get: async () => { // Fallback if no orderBy/limit
              await delay(200);
              return {
                docs: filteredData.map(doc => ({ id: doc.id, data: () => doc, exists: () => true })),
                empty: filteredData.length === 0,
              };
            }
          };
        }
        // Fallback for unmocked operators
        return { get: async () => ({ docs: [], empty: true }) };
      },
       addDoc: async (newData: any) => {
        await delay(150);
        const newId = `mock-${name}-${Date.now()}`;
        const newDocument = { ...newData, id: newId, createdAt: newData.createdAt || new Date().toISOString() };
         if (name === 'posts') {
            (mockPosts as any[]).push(newDocument);
        } else if (name === 'moodEntries') {
            (mockMoodEntries as any[]).push(newDocument);
        } else {
            data.push(newDocument);
        }
        return Promise.resolve({ id: newId }); // Return a mock DocRef-like object with id
      },
    };
  },
};


// Mock Authentication
let currentMockUser: User | null = null;
const authListeners: Array<(user: User | null) => void> = [];

export const mockAuth = {
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    authListeners.push(callback);
    // Immediately notify with current user, similar to Firebase
    Promise.resolve().then(() => callback(currentMockUser)); 
    return () => { // Unsubscribe function
      const index = authListeners.indexOf(callback);
      if (index > -1) authListeners.splice(index, 1);
    };
  },
  signInWithEmailAndPassword: async (email: string, pass: string) => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email); // Simplified: no password check
    if (user) {
      currentMockUser = user;
      authListeners.forEach(listener => listener(currentMockUser));
      return { user: currentMockUser };
    }
    throw new Error("Mock Auth: User not found or incorrect password.");
  },
  createUserWithEmailAndPassword: async (email: string, pass: string, displayName?: string) => {
    await delay(500);
    if (mockUsers.some(u => u.email === email)) {
      throw new Error("Mock Auth: Email already in use.");
    }
    const newUser: User = {
      uid: `mockuser-${Date.now()}`,
      email,
      displayName: displayName || 'New User',
      photoURL: `https://placehold.co/100x100.png?text=${(displayName || "N").charAt(0)}`,
      emailVerified: false, // Default, can be omitted if not used
      bio: '',
    } as User; // Cast to User
    mockUsers.push(newUser);
    currentMockUser = newUser;

    // Simulate creating user doc in 'users' collection
    const userDoc = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        bio: '',
    };
    (mockDb.collection('users') as any).doc(newUser.uid).set(userDoc);


    authListeners.forEach(listener => listener(currentMockUser));
    return { user: currentMockUser };
  },
  signInWithPopup: async (/*provider: any*/) => { // Provider not used in mock
    await delay(500);
    // Simulate Google sign-in with a predefined or first mock user
    currentMockUser = mockUsers[0] || null; 
    if (currentMockUser) {
       // Ensure this user exists in mockUsers collection or add them
      const userRef = mockDb.collection('users').doc(currentMockUser.uid);
      const userSnap = await userRef.get();
      if (!userSnap.exists()) {
        await userRef.set({
          uid: currentMockUser.uid,
          email: currentMockUser.email,
          displayName: currentMockUser.displayName,
          photoURL: currentMockUser.photoURL || `https://placehold.co/100x100.png?text=${currentMockUser.displayName?.charAt(0)}`,
          bio: currentMockUser.bio || '',
        });
      }
    }
    authListeners.forEach(listener => listener(currentMockUser));
    return { user: currentMockUser };
  },
  signOut: async () => {
    await delay(100);
    currentMockUser = null;
    authListeners.forEach(listener => listener(currentMockUser));
  },
  updateProfile: async (currentUser: User, profileData: Partial<Pick<User, 'displayName' | 'photoURL' | 'bio'>>) => {
     await delay(200);
    if (!currentUser) throw new Error("Mock Auth: No user to update.");
    
    const userIndex = mockUsers.findIndex(u => u.uid === currentUser.uid);
    if (userIndex > -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...profileData } as User;
      currentMockUser = mockUsers[userIndex]; // Update currentMockUser as well

       // Also update the user document in mockDb 'users' collection
      const userDocRef = mockDb.collection('users').doc(currentUser.uid);
      const userSnap = await userDocRef.get();
      if (userSnap.exists()) {
        await userDocRef.update(profileData);
      }

      authListeners.forEach(listener => listener(currentMockUser));
      return Promise.resolve();
    }
    throw new Error("Mock Auth: User not found for update.");
  },
  get currentUser() {
    return currentMockUser;
  }
};

// Firebase App (mocked)
const mockApp = {
  name: '[MOCK_APP]',
  options: {},
  automaticDataCollectionEnabled: false,
};

// Export mocks
export const auth = mockAuth;
export const db = mockDb;

// Mock GoogleAuthProvider if it's directly imported elsewhere (though typically used with signInWithPopup)
export class GoogleAuthProvider {
  // Mock implementation, can be empty or have mock methods if needed
}

// Compatibility exports that might be expected by other files
export const initializeApp = () => mockApp;
export const getApps = () => [mockApp]; // Simulate app already initialized
export const getAuth = () => mockAuth;
export const getFirestore = () => mockDb;


// Firestore specific types (can be simplified or expanded as needed for mock)
export type Timestamp = Date; // Mock Timestamp as JS Date
export const collection = (firestoreInstance: any, path: string) => firestoreInstance.collection(path);
export const doc = (firestoreInstance: any, path: string, ...pathSegments: string[]) => {
    const fullPath = [path, ...pathSegments].join('/');
    // This mock assumes path is 'collectionName/docId'
    const [collectionName, docId] = fullPath.split('/');
    if (collectionName && docId) {
        return firestoreInstance.collection(collectionName).doc(docId);
    }
    // Fallback for more complex paths, needs better handling for real nesting
    return firestoreInstance.collection(path); // Simplified
};
export const getDoc = async (docRef: any) => docRef.get();
export const getDocs = async (queryRef: any) => queryRef.get();
export const addDoc = async (collectionRef: any, data: any) => collectionRef.addDoc(data);
export const setDoc = async (docRef: any, data: any) => docRef.set(data);
export const updateDoc = async (docRef: any, data: any) => docRef.update(data);
export const query = (collectionRef: any, ...constraints: any[]) => {
    let q = collectionRef;
    // Apply mock constraints - very simplified
    for (const constraint of constraints) {
        if (constraint.type === 'where') {
            q = q.where(constraint.field, constraint.opStr, constraint.value);
        } else if (constraint.type === 'orderBy') {
            q = q.orderBy(constraint.field, constraint.direction);
        } else if (constraint.type === 'limit') {
            q = q.limit(constraint.limit);
        }
    }
    return q;
};
export const where = (field: string, opStr: string, value: any) => ({ type: 'where', field, opStr, value });
export const orderBy = (field: string, direction: string = 'asc') => ({ type: 'orderBy', field, direction });
export const limit = (num: number) => ({ type: 'limit', limit: num });
export const serverTimestamp = () => new Date(); // Mock serverTimestamp

