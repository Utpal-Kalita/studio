// This is a mock Firebase setup for development without actual Firebase.
// Replace with your actual Firebase configuration.

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

// Mock Firestore
const mockFirestore = {
  collection: (_path: string) => ({
    doc: (_id?: string) => ({
      get: async () => {
        // Simulate fetching a document
        if (_path === 'users' && _id === mockAuth.currentUser?.uid) {
          return { exists: true, data: () => mockAuth.currentUser };
        }
        return { exists: false, data: () => null };
      },
      set: async (data: any) => {
        // Simulate setting a document
        if (_path === 'users' && mockAuth.currentUser && data.uid === mockAuth.currentUser.uid) {
          mockAuth.currentUser = { ...mockAuth.currentUser, ...data };
        }
        console.log(`Mock Firestore: set data in ${_path}/${_id || '(auto-id)'}`, data);
      },
      update: async (data: any) => {
         // Simulate updating a document
        if (_path === 'users' && mockAuth.currentUser && data.uid === mockAuth.currentUser.uid) {
          mockAuth.currentUser = { ...mockAuth.currentUser, ...data };
        }
        console.log(`Mock Firestore: update data in ${_path}/${_id || '(auto-id)'}`, data);
      },
      onSnapshot: (callback: any) => {
        // Simulate realtime updates
        setTimeout(() => callback({ docs: mockDb[_path as keyof typeof mockDb]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] }), 100);
        return () => {}; // Unsubscribe
      }
    }),
    add: async (data: any) => {
      const id = `mock-id-${Math.random().toString(36).substr(2, 9)}`;
      console.log(`Mock Firestore: add data to ${_path}`, { id, ...data });
      if (!mockDb[_path as keyof typeof mockDb]) mockDb[_path as keyof typeof mockDb] = [];
      (mockDb[_path as keyof typeof mockDb] as any[]).push({ id, ...data });
      return { id };
    },
    where: () => ({ // Basic mock for where queries
      get: async () => {
        return { docs: mockDb[_path as keyof typeof mockDb]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] };
      }
    }),
    orderBy: () => ({ // Basic mock for orderBy queries
      limit: () => ({
        get: async () => {
         return { docs: mockDb[_path as keyof typeof mockDb]?.map((doc: any) => ({ id: doc.id, data: () => doc })) || [] };
        }
      })
    })
  }),
};

// In-memory DB for mock Firestore
const mockDb: {
  users?: User[];
  moodEntries?: any[];
  communities?: any[];
  posts?: any[];
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
    { id: 'post1', communityId: 'anxiety', userId: 'test-uid', userName: 'Test User', title: 'Feeling overwhelmed today', content: 'Just wanted to share that I\'m feeling a bit overwhelmed with work and life. Anyone else relate?', createdAt: new Date().toISOString(), reactions: 5, comments: [] },
    { id: 'post2', communityId: 'anxiety', userId: 'another-user', userName: 'Jane Doe', title: 'Coping mechanisms', content: 'What are some coping mechanisms you find helpful for anxiety attacks?', createdAt: new Date().toISOString(), reactions: 12, comments: [] },
  ],
  resources: [
    { id: 'res1', title: 'Deep Breathing Exercise', type: 'Exercise', topic: 'Stress', description: 'A guided exercise for quick stress relief.', contentUrl: '#', icon: 'Wind' },
    { id: 'res2', title: 'Understanding Anxiety', type: 'Article', topic: 'Anxiety', description: 'An informative article about anxiety disorders.', contentUrl: '#', icon: 'FileText' },
    { id: 'res3', title: 'Mindfulness Meditation', type: 'Video', topic: 'Sleep', description: 'A 10-minute guided meditation for better sleep.', contentUrl: '#', icon: 'Youtube' },
  ],
};


// Export mocks as if they are from 'firebase/auth' and 'firebase/firestore'
export const auth = mockAuth;
export const db = mockFirestore;

// Mock GoogleAuthProvider
export class GoogleAuthProvider {};

// Helper to simulate a delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
