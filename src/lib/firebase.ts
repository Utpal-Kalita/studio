
// This is a mock Firebase setup for development without actual Firebase.
// Replace with your actual Firebase configuration.
import type { Post } from '@/components/community/PostCard';


export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
}

// Mock Auth
const mockAuth = {
  currentUser: null as User | null,
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Simulate async auth state change
    setTimeout(() => callback(mockAuth.currentUser), 100);
    const unsubscribe = () => {};
    return unsubscribe;
  },
  signInWithEmailAndPassword: async (email: string, _: string): Promise<{ user: User }> => {
    if (email === 'test@example.com') {
      mockAuth.currentUser = { uid: 'test-uid', email, displayName: 'Test User', photoURL: 'https://placehold.co/100x100.png', bio: 'This is a test bio.' };
      return { user: mockAuth.currentUser };
    }
    throw new Error('auth/wrong-password');
  },
  createUserWithEmailAndPassword: async (email: string, _: string): Promise<{ user: User }> => {
    mockAuth.currentUser = { uid: 'new-uid', email, displayName: 'New User', photoURL: 'https://placehold.co/100x100.png', bio: '' };
    return { user: mockAuth.currentUser };
  },
  signInWithPopup: async (_provider: any): Promise<{ user: User }> => { // provider would be GoogleAuthProvider
    mockAuth.currentUser = { uid: 'google-uid', email: 'googleuser@example.com', displayName: 'Google User', photoURL: 'https://placehold.co/100x100.png', bio: '' };
    return { user: mockAuth.currentUser };
  },
  signOut: async () => {
    mockAuth.currentUser = null;
  },
  updateProfile: async (user: User, profile: Partial<User>): Promise<void> => {
    if (mockAuth.currentUser && mockAuth.currentUser.uid === user.uid) {
       mockAuth.currentUser = { ...mockAuth.currentUser, ...profile };
    }
  }
};

// In-memory DB for mock Firestore
const mockDbData: {
  users?: User[];
  moodEntries?: any[];
  communities?: any[];
  posts?: Post[]; // Typed Post array
  resources?: any[];
} = {
  users: [],
  moodEntries: [
    { id: 'mood1', userId: 'test-uid', mood: 'Happy', journal: 'Great day!', date: new Date(2024, 6, 1).toISOString() },
    { id: 'mood2', userId: 'test-uid', mood: 'Okay', journal: '', date: new Date(2024, 6, 2).toISOString() },
  ],
  communities: [
    { id: 'anxiety', name: 'Anxiety Support', description: 'A safe space to discuss anxiety.', icon: 'ShieldAlert' },
    { id: 'depression', name: 'Depression & Low Mood', description: 'Share and find support for depression.', icon: 'CloudRain' },
    { id: 'addiction', name: 'Addiction Recovery', description: 'Support for overcoming addiction.', icon: 'HeartHandshake' },
    { id: 'self-growth', name: 'Self-Growth Journey', description: 'Cultivating personal development.', icon: 'Sunrise' },
  ],
  posts: [
    { id: 'post1', communityId: 'anxiety', userId: 'test-uid', userName: 'Test User', title: 'Feeling overwhelmed today', content: 'Just wanted to share that I\'m feeling a bit overwhelmed with work and life. Anyone else relate?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), reactions: 5, commentsCount: 2 },
    { id: 'post2', communityId: 'anxiety', userId: 'another-user', userName: 'Jane Doe', title: 'Coping mechanisms', content: 'What are some coping mechanisms you find helpful for anxiety attacks?', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), reactions: 12, commentsCount: 4 },
    { 
      id: 'demo-post-addiction', 
      communityId: 'addiction', 
      userId: 'wellverse-admin', 
      userName: 'WellVerse Admin', 
      userAvatar: 'https://placehold.co/40x40.png', 
      title: 'Welcome to the Addiction Recovery Space!', 
      content: 'This is a safe space to share your journey, find support, and connect with others on the path to recovery. Remember, you\'re not alone. Feel free to introduce yourself or share what\'s on your mind.', 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), 
      reactions: 3 ,
      commentsCount: 1
    },
    { 
      id: 'demo-post-anxiety-welcome', 
      communityId: 'anxiety', 
      userId: 'wellverse-admin', 
      userName: 'WellVerse Admin', 
      userAvatar: 'https://placehold.co/40x40.png', 
      title: 'Welcome to the Anxiety & Stress Support Group!', 
      content: 'Hello everyone! This community is here to provide a supportive environment for anyone dealing with anxiety or stress. Share your experiences, ask questions, and find comfort in knowing you\'re not alone. Let\'s support each other.', 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), 
      reactions: 5,
      commentsCount: 3
    },
    { 
      id: 'demo-post-depression', 
      communityId: 'depression', 
      userId: 'wellverse-admin', 
      userName: 'WellVerse Admin', 
      userAvatar: 'https://placehold.co/40x40.png', 
      title: 'A Gentle Welcome to Our Depression Support Community', 
      content: 'If you\'re navigating depression or low mood, please know this is a space for understanding and shared experiences. You are welcome here. Feel free to share as much or as little as you\'re comfortable with. We\'re here to listen.', 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), 
      reactions: 4,
      commentsCount: 0
    },
    { 
      id: 'demo-post-self-growth', 
      communityId: 'self-growth', 
      userId: 'wellverse-admin', 
      userName: 'WellVerse Admin', 
      userAvatar: 'https://placehold.co/40x40.png', 
      title: 'Embark on Your Self-Growth Journey With Us!', 
      content: 'Welcome to the Self-Growth & Development community! This is a place to explore personal development, share insights, set goals, and support each other in becoming our best selves. What are you working on today?', 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), 
      reactions: 6,
      commentsCount: 2
    }
  ],
  resources: [
    { id: 'res1', title: 'Deep Breathing Exercise', type: 'Exercise', topic: 'Stress', description: 'A guided exercise for quick stress relief.', contentUrl: '#', icon: 'Wind' },
    { id: 'res2', title: 'Understanding Anxiety', type: 'Article', topic: 'Anxiety', description: 'An informative article about anxiety disorders.', contentUrl: '#', icon: 'FileText' },
    { id: 'res3', title: 'Mindfulness Meditation', type: 'Video', topic: 'Sleep', description: 'A 10-minute guided meditation for better sleep.', contentUrl: '#', icon: 'Youtube' },
  ],
};


// Mock Firestore
const mockFirestore = {
  collection: (path: string) => ({
    doc: (_id?: string) => ({
      get: async () => {
        // Simulate fetching a document
        if (path === 'users' && _id === mockAuth.currentUser?.uid) {
          return { exists: true, data: () => mockAuth.currentUser };
        }
        // For other collections, find by id
        const collectionData = mockDbData[path as keyof typeof mockDbData] as any[];
        const doc = collectionData?.find(d => d.id === _id);
        return { exists: !!doc, data: () => doc };
      },
      set: async (data: any) => {
        if (path === 'users' && mockAuth.currentUser && data.uid === mockAuth.currentUser.uid) {
          mockAuth.currentUser = { ...mockAuth.currentUser, ...data };
        }
        // For other collections, update or add
        const collectionData = mockDbData[path as keyof typeof mockDbData] as any[];
        if (collectionData) {
            const index = collectionData.findIndex(d => d.id === _id);
            if (index > -1) {
                collectionData[index] = { ...collectionData[index], ...data };
            } else if (_id) {
                collectionData.push({ id: _id, ...data });
            }
        }
        console.log(`Mock Firestore: set data in ${path}/${_id || '(auto-id)'}`, data);
      },
      update: async (data: any) => {
        if (path === 'users' && mockAuth.currentUser && _id === mockAuth.currentUser.uid) { // Check _id for user updates
          mockAuth.currentUser = { ...mockAuth.currentUser, ...data };
        }
        const collectionData = mockDbData[path as keyof typeof mockDbData] as any[];
        if (collectionData) {
            const index = collectionData.findIndex(d => d.id === _id);
            if (index > -1) {
                collectionData[index] = { ...collectionData[index], ...data };
            }
        }
        console.log(`Mock Firestore: update data in ${path}/${_id || '(auto-id)'}`, data);
      },
      onSnapshot: (callback: any) => {
        setTimeout(() => callback({ docs: mockDbData[path as keyof typeof mockDbData]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] }), 100);
        return () => {};
      }
    }),
    add: async (data: Omit<Post, 'id' | 'createdAt' | 'reactions' | 'commentsCount'>) => {
      const id = `mock-id-${Math.random().toString(36).substr(2, 9)}`;
      const newPost: Post = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
        reactions: 0,
        commentsCount: 0,
      };
      
      if (!mockDbData[path as keyof typeof mockDbData]) mockDbData[path as keyof typeof mockDbData] = [];
      (mockDbData[path as keyof typeof mockDbData] as any[]).unshift(newPost); // Add to beginning for chronological order
      console.log(`Mock Firestore: add data to ${path}`, newPost);
      return { id }; // Return the id of the newly created document
    },
    where: () => ({ 
      get: async () => {
        return { docs: mockDbData[path as keyof typeof mockDbData]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] };
      }
    }),
    orderBy: () => ({ 
      limit: () => ({
        get: async () => {
         return { docs: mockDbData[path as keyof typeof mockDbData]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] };
        }
      })
    })
  }),
};


// Export mocks as if they are from 'firebase/auth' and 'firebase/firestore'
export const auth = mockAuth;
export const db = mockFirestore;

// Mock GoogleAuthProvider
export class GoogleAuthProvider {};

// Helper to simulate a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
